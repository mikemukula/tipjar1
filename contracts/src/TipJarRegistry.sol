// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "./interfaces/IERC20.sol";
import {Ownable} from "./utils/Ownable.sol";
import {ReentrancyGuard} from "./utils/ReentrancyGuard.sol";

/**
 * @title TipJarRegistry
 * @notice Peer-to-peer G$ tipping platform on Celo.
 *
 * Creators register a username → wallet mapping on-chain.
 * Tips flow directly from fan → creator wallet via G$ transferFrom.
 * No funds are ever held by this contract.
 *
 * G$ (GoodDollar) on Celo: 0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c14
 */
contract TipJarRegistry is Ownable, ReentrancyGuard {
    // ─── State ────────────────────────────────────────────────────────────────

    IERC20 public goodDollar;

    struct Creator {
        address wallet;
        string  username;
        bool    isActive;
    }

    /// username (lowercase) → Creator
    mapping(string => Creator) private _creatorByUsername;
    /// wallet address → username (lowercase)
    mapping(address => string) private _usernameByWallet;

    // ─── Events ───────────────────────────────────────────────────────────────

    event CreatorRegistered(address indexed wallet, string username);
    event CreatorUpdated(address indexed wallet, string oldUsername, string newUsername);
    event CreatorDeactivated(address indexed wallet, string username);

    event TipSent(
        address indexed from,
        address indexed to,
        string  indexed creatorUsername,
        uint256 amount,
        string  message
    );

    // ─── Errors ───────────────────────────────────────────────────────────────

    error UsernameAlreadyTaken(string username);
    error WalletAlreadyRegistered(address wallet);
    error NotRegistered();
    error InvalidUsername();
    error InvalidAmount();
    error CreatorNotFound(string username);
    error CreatorInactive(string username);
    error TransferFailed();

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor(address _goodDollar) Ownable(msg.sender) {
        goodDollar = IERC20(_goodDollar);
    }

    // ─── Creator Registration ─────────────────────────────────────────────────

    /**
     * @notice Register as a creator. Caller's wallet becomes the tip recipient.
     * @param username  Lowercase alphanumeric handle (3–32 chars, hyphens ok).
     */
    function registerCreator(string calldata username) external {
        string memory lower = _toLower(username);
        _validateUsername(lower);

        if (_creatorByUsername[lower].wallet != address(0)) {
            revert UsernameAlreadyTaken(lower);
        }
        if (bytes(_usernameByWallet[msg.sender]).length != 0) {
            revert WalletAlreadyRegistered(msg.sender);
        }

        _creatorByUsername[lower] = Creator({
            wallet:   msg.sender,
            username: lower,
            isActive: true
        });
        _usernameByWallet[msg.sender] = lower;

        emit CreatorRegistered(msg.sender, lower);
    }

    /**
     * @notice Change your registered username.
     */
    function updateUsername(string calldata newUsername) external {
        string memory lower = _toLower(newUsername);
        _validateUsername(lower);

        string memory old = _usernameByWallet[msg.sender];
        if (bytes(old).length == 0) revert NotRegistered();
        if (_creatorByUsername[lower].wallet != address(0)) {
            revert UsernameAlreadyTaken(lower);
        }

        delete _creatorByUsername[old];
        _creatorByUsername[lower] = Creator({
            wallet:   msg.sender,
            username: lower,
            isActive: true
        });
        _usernameByWallet[msg.sender] = lower;

        emit CreatorUpdated(msg.sender, old, lower);
    }

    /**
     * @notice Deactivate your creator profile.
     */
    function deactivate() external {
        string memory username = _usernameByWallet[msg.sender];
        if (bytes(username).length == 0) revert NotRegistered();

        _creatorByUsername[username].isActive = false;
        emit CreatorDeactivated(msg.sender, username);
    }

    // ─── Tipping ──────────────────────────────────────────────────────────────

    /**
     * @notice Send a G$ tip to a creator by username.
     * @dev    Caller must have approved this contract for `amount` G$ beforehand.
     * @param  creatorUsername  The creator's registered handle.
     * @param  amount           Amount of G$ (in token units, 18 decimals).
     * @param  message          Optional message (max 280 chars).
     */
    function sendTip(
        string calldata creatorUsername,
        uint256 amount,
        string calldata message
    ) external nonReentrant {
        if (amount == 0) revert InvalidAmount();

        string memory lower = _toLower(creatorUsername);
        Creator memory creator = _creatorByUsername[lower];

        if (creator.wallet == address(0)) revert CreatorNotFound(lower);
        if (!creator.isActive) revert CreatorInactive(lower);

        // Transfer G$ directly from fan → creator (no contract custody)
        bool ok = goodDollar.transferFrom(msg.sender, creator.wallet, amount);
        if (!ok) revert TransferFailed();

        emit TipSent(msg.sender, creator.wallet, lower, amount, message);
    }

    // ─── Views ────────────────────────────────────────────────────────────────

    function getCreator(string calldata username)
        external
        view
        returns (address wallet, bool isActive)
    {
        string memory lower = _toLower(username);
        Creator memory c = _creatorByUsername[lower];
        return (c.wallet, c.isActive);
    }

    function getUsernameByWallet(address wallet)
        external
        view
        returns (string memory)
    {
        return _usernameByWallet[wallet];
    }

    function isRegistered(address wallet) external view returns (bool) {
        return bytes(_usernameByWallet[wallet]).length != 0;
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    /**
     * @notice Update the G$ token address (in case of token migration).
     */
    function setGoodDollarToken(address newToken) external onlyOwner {
        goodDollar = IERC20(newToken);
    }

    /**
     * @notice Admin can deactivate a creator (abuse / spam).
     */
    function adminDeactivate(string calldata username) external onlyOwner {
        string memory lower = _toLower(username);
        Creator storage c = _creatorByUsername[lower];
        if (c.wallet == address(0)) revert CreatorNotFound(lower);
        c.isActive = false;
        emit CreatorDeactivated(c.wallet, lower);
    }

    // ─── Internals ────────────────────────────────────────────────────────────

    function _validateUsername(string memory username) internal pure {
        bytes memory b = bytes(username);
        if (b.length < 3 || b.length > 32) revert InvalidUsername();
        for (uint256 i = 0; i < b.length; i++) {
            bytes1 c = b[i];
            bool valid = (c >= 0x61 && c <= 0x7A) // a-z
                || (c >= 0x30 && c <= 0x39)        // 0-9
                || c == 0x2D;                       // hyphen
            if (!valid) revert InvalidUsername();
        }
    }

    function _toLower(string calldata s) internal pure returns (string memory) {
        bytes memory b = bytes(s);
        bytes memory result = new bytes(b.length);
        for (uint256 i = 0; i < b.length; i++) {
            bytes1 c = b[i];
            if (c >= 0x41 && c <= 0x5A) {
                result[i] = bytes1(uint8(c) + 32);
            } else {
                result[i] = c;
            }
        }
        return string(result);
    }
}
