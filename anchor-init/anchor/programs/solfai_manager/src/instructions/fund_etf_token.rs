use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct FundEtfToken<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
}

impl<'info> FundEtfToken<'info> {
    pub fn fund_etf_token(&mut self) -> Result<()> {
        dbg!("fund etf token");

        // TODO: fund etf token

        Ok(())
    }
}

