use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct UserFunding {
    pub etf_token_vault_id: u64,
    pub user: Pubkey,
    pub total_amount: u64,
    pub last_updated: u64,
    pub claimed: bool,
    pub bump: u8,
}