export async function applyDailyInterest(account: any) {
  const today = new Date();
  const lastInterestDate = account.lastInterestDate ? new Date(account.lastInterestDate) : new Date();

  // Calculate difference in days
  const diffTime = today.getTime() - lastInterestDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0 && account.loan > 0) {
    const rate = account.interestRate || 0.17;
    const interest = account.loan * rate * diffDays; // interest for all days passed

    account.interest += interest;
    account.lastInterestDate = today;

    account.transactions.push({
      type: "INTEREST",
      amount: interest,
      date: today,
    });
  }
}
