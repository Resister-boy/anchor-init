use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct EtfTokenMetadata {
    #[max_len(10)]
    pub symbol: String,
    #[max_len(300)]
    pub uri: String,
    pub mint: Pubkey,
}