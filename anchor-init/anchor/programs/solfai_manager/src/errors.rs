use anchor_lang::error_code;

#[error_code]
pub enum SolfaiManagerError {
    #[msg("Invalid etf vault funding goal")]
    InvalidEtfVaultFundingGoal,

    #[msg("Exceed etf vault funding goal")]
    ExceedEtfVaultFundingGoal,

    #[msg("Invalid mint account")]
    InvalidMintAccount,
    
    #[msg("Uninitialized mint account")]
    UninitializedMintAccount,

    #[msg("Insufficient funded amount")]
    InsufficientFundedAmount,

    #[msg("Funding stage ended")]
    FundingStageEnded,
    
    #[msg("Claim stage ended")]
    ClaimStageEnded,

    #[msg("Already claimed")]
    AlreadyClaimed,

    #[msg("Invalid token mint authority")]
    InvalidTokenMintAuthority, // TODO: checking authority
}