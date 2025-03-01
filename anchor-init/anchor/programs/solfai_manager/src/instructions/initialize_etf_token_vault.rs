use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeEtfTokenVault<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
}

impl<'info> InitializeEtfTokenVault<'info> {
    pub fn initialize_etf_token_vault(&mut self) -> Result<()> {

        dbg!("initialize etf token vault");

        // TODO: initialize etf token vault

        Ok(())
    }
}
