import { initializeDatabase, AppDataSource, Organizations, Subscriptions, SubscriptionSeats, Moneys, BillingHistories, CreditCard } from "~/.server/db";
import type { RegisterAppDto, RegisterAppResponseDto } from "~/routes/dto/app";

export async function integrateApp(
  data: RegisterAppDto,
): Promise<RegisterAppResponseDto> {
  const { workspace, members, paymentInfo, paymentHistory, organizationId, productId } = data;

  await initializeDatabase();

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const organization = await queryRunner.manager.findOne(Organizations, {
      where: {
        id: organizationId,
      },
    });

    if (!organization) {
      throw new Error("not found organization");
    }

    const currentBillingAmount = createCurrentBillingAmount(paymentInfo.price);
    const savedCurrentBillingAmount = await queryRunner.manager.save(currentBillingAmount);

    const creditCard = createCreditCard(paymentInfo.lastFourDigits, organization);
    const savedCreditCard = await queryRunner.manager.save(creditCard);

    const subscription = createSubscription(
      productId, 
      organization, 
      members, 
      savedCurrentBillingAmount, 
      savedCreditCard, 
      paymentInfo.planName
    );
    const savedSubscription = await queryRunner.manager.save(subscription);

    const savedSeats = await createSubscriptionSeats(savedSubscription.id, members, queryRunner);

    if (paymentHistory && paymentHistory.length > 0) {
      for (const payment of paymentHistory) {
        const billingHistory = createBillingHistory(payment, savedSubscription.id, organization);
        await queryRunner.manager.save(billingHistory);
      }
    }

    await queryRunner.commitTransaction();

    return {
      subscriptionId: savedSubscription.id,
      savedSeats,
    };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

function createMoneyEntity(amountString: string): Moneys {
  const usdMatch = amountString.match(/^\$?(\d+(?:\.\d{2})?)$/);
  if (usdMatch) {
    const amount = parseFloat(usdMatch[1]);
    return Moneys.create({
      text: amountString,
      symbol: "$",
      amount: amount,
      code: "USD" as const,
      format: "%n",
      exchangeRate: 1,
      exchangedCurrency: "USD" as const,
      dollarPrice: amount
    });
  }

  const krwMatch = amountString.match(/^(\d{1,3}(?:,\d{3})*|\d+)원?$/);
  if (krwMatch) {
    const cleanAmount = krwMatch[1].replace(/,/g, '');
    const amount = parseInt(cleanAmount);
    return Moneys.create({
      text: amountString,
      symbol: "원",
      amount: amount,
      code: "KRW" as const,
      format: "%n",
      exchangeRate: 1,
      exchangedCurrency: "KRW" as const,
      dollarPrice: amount / 1300
    });
  }

  return Moneys.create({
    text: amountString,
    symbol: "$",
    amount: 0,
    code: "USD" as const,
    format: "%n",
    exchangeRate: 1,
    exchangedCurrency: "USD" as const,
    dollarPrice: 0
  });
}

function createBillingHistory(
  paymentHistory: { date: string; amount: string; invoiceUrl: string },
  subscriptionId: number,
  organization: Organizations
): BillingHistories {
  const payAmount = createMoneyEntity(paymentHistory.amount);
  
  return BillingHistories.create({
    subscriptionId: subscriptionId,
    organization: organization,
    paidAt: new Date(paymentHistory.date),
    invoiceUrl: paymentHistory.invoiceUrl,
    issuedAt: new Date(paymentHistory.date),
    paymentMethod: "CARD",
    emailContent: null,
    memo: null,
    isDomestic: 1,
    isVatDeductible: 0,
    connectMethod: "MANUAL",
    payAmount: payAmount
  });
}

function createSubscription(
  productId: number,
  organization: Organizations,
  members: Array<{ status: string }>,
  currentBillingAmount: Moneys,
  creditCard: CreditCard,
  planName: string
): Subscriptions {
  return Subscriptions.create({
    productId: productId,
    organization: organization,
    connectMethod: "MANUAL",
    accountCount: members.length,
    usedMemberCount: members.length,
    paidMemberCount: members.filter((m) => m.status === "active").length,
    status: "PAYMENT_SUCCESS",
    connectStatus: "SUCCESS",
    pricingModel: "PER_SEAT",
    isPerUser: 1,
    registeredAt: new Date(),
    currentBillingAmount: currentBillingAmount,
    creditCard: creditCard,
    billingCycleType: getBillingCycleType(),
    alias: planName,
  });
}

async function createSubscriptionSeats(
  subscriptionId: number,
  members: Array<{ status: string; joinDate: string }>,
  queryRunner: any
): Promise<number> {
  let savedSeats = 0;
  
  for (const member of members) {
    const subscriptionSeat = SubscriptionSeats.create({
      subscriptionId: subscriptionId,
      teamMemberId: null,
      status: member.status === "active" ? "PAID" : "QUIT",
      isPaid: member.status === "active" ? 1 : 0,
      startAt: member.joinDate ? new Date(member.joinDate) : new Date(),
    });

    await queryRunner.manager.save(subscriptionSeat);
    savedSeats++;
  }
  
  return savedSeats;
}

function getBillingCycleType(): "None" {
  return "None";
}

function createCurrentBillingAmount(price: string): Moneys {
  return createMoneyEntity(price);
}

function createCreditCard(lastFourDigits: string, organization: Organizations): CreditCard {
  return CreditCard.create({
    number_4: lastFourDigits,
    organization: organization,
    isPersonal: 0,
    usingStatus: 2,
    isCreditCard: 1,
    monthlyPaidAmount: 0,
    subscriptionCount: 0
  });
}
