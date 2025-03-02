use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct FundEtfToken {
}


impl<'info> FundEtfToken<> {
    pub fn fund_etf_token(&mut self) -> Result<()> {
        msg!("fund etf token");

        // TODO: fund etf token

        Ok(())
    }
}
