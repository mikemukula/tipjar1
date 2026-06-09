// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {TipJarRegistry} from "../src/TipJarRegistry.sol";

/// @dev Minimal ERC-20 mock for testing
contract MockGoodDollar {
    string public name   = "GoodDollar";
    string public symbol = "G$";
    uint8  public decimals = 18;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "insufficient");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "insufficient");
        require(allowance[from][msg.sender] >= amount, "not approved");
        balanceOf[from] -= amount;
        allowance[from][msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

contract TipJarRegistryTest is Test {
    TipJarRegistry public registry;
    MockGoodDollar public gd;

    address public owner   = address(0x1);
    address public alice   = address(0x2); // creator
    address public bob     = address(0x3); // fan/tipper
    address public charlie = address(0x4); // another creator

    uint256 constant ONE_G = 1e18; // 1 G$ in wei

    function setUp() public {
        vm.startPrank(owner);
        gd = new MockGoodDollar();
        registry = new TipJarRegistry(address(gd));
        vm.stopPrank();

        // Give bob 1000 G$ and a large allowance
        gd.mint(bob, 1000 * ONE_G);
        vm.prank(bob);
        gd.approve(address(registry), type(uint256).max);
    }

    // ─── Registration tests ───────────────────────────────────────────────────

    function test_RegisterCreator() public {
        vm.prank(alice);
        registry.registerCreator("alice");

        (address wallet, bool isActive) = registry.getCreator("alice");
        assertEq(wallet, alice);
        assertTrue(isActive);
        assertEq(registry.getUsernameByWallet(alice), "alice");
        assertTrue(registry.isRegistered(alice));
    }

    function test_RegisterCreator_Lowercase() public {
        vm.prank(alice);
        registry.registerCreator("ALICE"); // should store as "alice"

        (address wallet,) = registry.getCreator("alice");
        assertEq(wallet, alice);
    }

    function test_RevertIf_DuplicateUsername() public {
        vm.prank(alice);
        registry.registerCreator("alice");

        vm.prank(charlie);
        vm.expectRevert(
            abi.encodeWithSelector(TipJarRegistry.UsernameAlreadyTaken.selector, "alice")
        );
        registry.registerCreator("alice");
    }

    function test_RevertIf_WalletAlreadyRegistered() public {
        vm.prank(alice);
        registry.registerCreator("alice");

        vm.prank(alice);
        vm.expectRevert(
            abi.encodeWithSelector(TipJarRegistry.WalletAlreadyRegistered.selector, alice)
        );
        registry.registerCreator("alice2");
    }

    function test_RevertIf_UsernameTooShort() public {
        vm.prank(alice);
        vm.expectRevert(TipJarRegistry.InvalidUsername.selector);
        registry.registerCreator("ab"); // < 3 chars
    }

    function test_RevertIf_UsernameTooLong() public {
        vm.prank(alice);
        vm.expectRevert(TipJarRegistry.InvalidUsername.selector);
        registry.registerCreator("this-username-is-way-too-long-abcde"); // > 32 chars
    }

    function test_RevertIf_UsernameInvalidChars() public {
        vm.prank(alice);
        vm.expectRevert(TipJarRegistry.InvalidUsername.selector);
        registry.registerCreator("alice!");
    }

    // ─── Username update tests ────────────────────────────────────────────────

    function test_UpdateUsername() public {
        vm.startPrank(alice);
        registry.registerCreator("alice");
        registry.updateUsername("alice-creator");
        vm.stopPrank();

        (address wallet,) = registry.getCreator("alice-creator");
        assertEq(wallet, alice);

        // old username should be gone
        (address oldWallet,) = registry.getCreator("alice");
        assertEq(oldWallet, address(0));
    }

    function test_RevertIf_UpdateUsername_NotRegistered() public {
        vm.prank(alice);
        vm.expectRevert(TipJarRegistry.NotRegistered.selector);
        registry.updateUsername("new-name");
    }

    // ─── Deactivation tests ───────────────────────────────────────────────────

    function test_Deactivate() public {
        vm.startPrank(alice);
        registry.registerCreator("alice");
        registry.deactivate();
        vm.stopPrank();

        (, bool isActive) = registry.getCreator("alice");
        assertFalse(isActive);
    }

    function test_RevertIf_TipToInactiveCreator() public {
        vm.prank(alice);
        registry.registerCreator("alice");

        vm.prank(alice);
        registry.deactivate();

        vm.prank(bob);
        vm.expectRevert(
            abi.encodeWithSelector(TipJarRegistry.CreatorInactive.selector, "alice")
        );
        registry.sendTip("alice", 10 * ONE_G, "hi");
    }

    // ─── Tip tests ────────────────────────────────────────────────────────────

    function test_SendTip() public {
        vm.prank(alice);
        registry.registerCreator("alice");

        uint256 aliceBefore = gd.balanceOf(alice);
        uint256 bobBefore   = gd.balanceOf(bob);

        vm.prank(bob);
        vm.expectEmit(true, true, true, true);
        emit TipJarRegistry.TipSent(bob, alice, "alice", 50 * ONE_G, "Great work!");
        registry.sendTip("alice", 50 * ONE_G, "Great work!");

        assertEq(gd.balanceOf(alice), aliceBefore + 50 * ONE_G);
        assertEq(gd.balanceOf(bob),   bobBefore   - 50 * ONE_G);
    }

    function test_SendTip_CaseInsensitive() public {
        vm.prank(alice);
        registry.registerCreator("alice");

        vm.prank(bob);
        registry.sendTip("ALICE", 10 * ONE_G, "");

        assertEq(gd.balanceOf(alice), 10 * ONE_G);
    }

    function test_RevertIf_TipZeroAmount() public {
        vm.prank(alice);
        registry.registerCreator("alice");

        vm.prank(bob);
        vm.expectRevert(TipJarRegistry.InvalidAmount.selector);
        registry.sendTip("alice", 0, "");
    }

    function test_RevertIf_TipUnknownCreator() public {
        vm.prank(bob);
        vm.expectRevert(
            abi.encodeWithSelector(TipJarRegistry.CreatorNotFound.selector, "nobody")
        );
        registry.sendTip("nobody", 10 * ONE_G, "");
    }

    function test_RevertIf_TipWithoutApproval() public {
        vm.prank(alice);
        registry.registerCreator("alice");

        address carol = address(0x5);
        gd.mint(carol, 100 * ONE_G);
        // carol has NOT approved the registry

        vm.prank(carol);
        vm.expectRevert();
        registry.sendTip("alice", 10 * ONE_G, "");
    }

    // ─── Admin tests ──────────────────────────────────────────────────────────

    function test_AdminDeactivate() public {
        vm.prank(alice);
        registry.registerCreator("alice");

        vm.prank(owner);
        registry.adminDeactivate("alice");

        (, bool isActive) = registry.getCreator("alice");
        assertFalse(isActive);
    }

    function test_RevertIf_NonOwnerCallsAdminDeactivate() public {
        vm.prank(alice);
        registry.registerCreator("alice");

        vm.prank(bob);
        vm.expectRevert();
        registry.adminDeactivate("alice");
    }

    function test_SetGoodDollarToken() public {
        address newToken = address(0xDEAD);
        vm.prank(owner);
        registry.setGoodDollarToken(newToken);
        assertEq(address(registry.goodDollar()), newToken);
    }
}
