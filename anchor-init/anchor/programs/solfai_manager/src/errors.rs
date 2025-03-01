use anchor_lang::error_code;

#[error_code]
pub enum SolfaiManagerError {
    #[msg("Invalid config state")]
    InvalidConfigState,
}