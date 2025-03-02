use anchor_lang::prelude::*;

pub const ETF_TOKEN_VAULT_STATUS_FUNDING: u8 = 0;
pub const ETF_TOKEN_VAULT_STATUS_OPERATING: u8 = 1;
pub const ETF_TOKEN_VAULT_STATUS_TERMINATED: u8 = 2;

pub const FUNDING_MINIMUM: u64 = 1_000_000_000;

#[account]
#[derive(InitSpace)]
pub struct EtfTokenVault {
    pub id: u64,
    pub creator: Pubkey,

    #[max_len(32)]
    pub etf_name: String,
    #[max_len(300)]
    pub description: String,

    pub funded_amount: u64,
    pub funding_goal: u64,
    pub funding_start_time: u64,
    pub funding_user_count: u64,

    pub status: u8, // 0: funding, 1: operating, 2: terminated
    
    // token metadata?
    
    pub bump: u8,
}
