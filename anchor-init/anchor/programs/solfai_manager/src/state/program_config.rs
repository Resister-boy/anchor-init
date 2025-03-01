use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct ProgramConfig {
    pub initialized: bool,
    pub admin: Pubkey,
    pub etf_token_count: u64,
    pub bump: u8,
}
