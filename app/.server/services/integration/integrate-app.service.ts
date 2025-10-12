import { initializeDatabase, AppDataSource, Organizations, Subscriptions, SubscriptionSeats, Moneys, BillingHistories, CreditCard, TeamMembers, ProductPaymentPlans, ProductBillingCycles, Products } from "~/.server/db";
import type { MemberDto, RegisterAppDto, RegisterAppResponseDto } from "~/routes/dto/app";

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

    const product = await queryRunner.manager.findOne(Products, {
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("not found product");
    }

    const currentBillingAmount = createCurrentBillingAmount(paymentInfo.currentPaymentAmount);
    const savedCurrentBillingAmount = await queryRunner.manager.save(currentBillingAmount);

    const nextBillingAmount = createMoneyEntity(paymentInfo.nextPaymentAmount);
    const savedNextBillingAmount = await queryRunner.manager.save(nextBillingAmount);

    const creditCard = createCreditCard(paymentInfo.cardNumber, organization);
    const savedCreditCard = await queryRunner.manager.save(creditCard);

    const paymentPlan = createProductPaymentPlan(paymentInfo.subscriptionPlanName, product);
    const savedPaymentPlan = await queryRunner.manager.save(paymentPlan);

    const priceAmount = parseFloat(paymentInfo.currentPaymentAmount.replace(/[^0-9.]/g, ''));
    const billingCycle = createProductBillingCycle(
      priceAmount,
      paymentInfo.billingCycleType.toLowerCase() === "monthly" ? "MONTHLY" : "YEARLY",
      savedPaymentPlan,
      product
    );
    const savedBillingCycle = await queryRunner.manager.save(billingCycle);

    const subscription = createSubscription(
      productId, 
      organization, 
      members, 
      savedCurrentBillingAmount, 
      savedCreditCard, 
      workspace.content,
      savedPaymentPlan,
      savedBillingCycle,
      paymentInfo.nextPaymentDate,
      savedNextBillingAmount
    );
    const savedSubscription = await queryRunner.manager.save(subscription);

    const savedSeats = await createSubscriptionSeats(savedSubscription.id, members, organization, queryRunner);

    if (paymentHistory && paymentHistory.length > 0) {
      for (const payment of paymentHistory) {
        const payAmount = createMoneyEntity(payment.amount);
        const savedPayAmount = await queryRunner.manager.save(payAmount);
        
        const billingHistory = createBillingHistory(payment, savedSubscription, organization, savedPayAmount);
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
  const usdMatch = amountString.match(/^(?:US\$|\$)?(\d+(?:\.\d{2})?)$/);
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
  subscription: Subscriptions,
  organization: Organizations,
  payAmount: Moneys
): BillingHistories {
  return BillingHistories.create({
    subscription: subscription,
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
  members: Array<MemberDto>,
  currentBillingAmount: Moneys,
  creditCard: CreditCard,
  workspaceContent: string,
  paymentPlan: ProductPaymentPlans,
  billingCycle: ProductBillingCycles,
  nextPaymentDate?: string,
  nextBillingAmount?: Moneys
): Subscriptions {
  const subscriptionData: any = {
    productId: productId,
    organization: organization,
    connectMethod: "MANUAL",
    accountCount: members.length,
    usedMemberCount: members.length,
    paidMemberCount: members.length,
    status: "PAYMENT_SUCCESS",
    connectStatus: "SUCCESS",
    pricingModel: "PER_SEAT",
    isPerUser: 1,
    registeredAt: new Date(),
    currentBillingAmount: currentBillingAmount,
    creditCard: creditCard,
    billingCycleType: getBillingCycleType(),
    alias: workspaceContent,
    paymentPlan: paymentPlan,
    billingCycle: billingCycle,
  };

  if (nextPaymentDate) {
    subscriptionData.nextBillingDate = new Date(nextPaymentDate);
  }

  if (nextBillingAmount) {
    subscriptionData.nextBillingAmount = nextBillingAmount;
  }

  return Subscriptions.create(subscriptionData);
}

async function createSubscriptionSeats(
  subscriptionId: number,
  members: Array<MemberDto>,
  organization: Organizations,
  queryRunner: any
): Promise<number> {
  let savedSeats = 0;
  
  for (const member of members) {
    let teamMember = await queryRunner.manager.findOne(TeamMembers, {
      where: {
        email: member.email,
      },
    });

    if (!teamMember) {
      const newTeamMember = TeamMembers.create({
        email: member.email,
        name: member.name,
        profileImgUrl: member.profileImgUrl,
        organization: organization,
      });
      await queryRunner.manager.save(newTeamMember);
      teamMember = newTeamMember;
    }

    const subscriptionSeat = SubscriptionSeats.create({
      subscriptionId: subscriptionId,
      teamMemberId: teamMember.id,
      status: "PAID",
      isPaid: 1,
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

function createProductPaymentPlan(planName: string, product: Products): ProductPaymentPlans {
  return ProductPaymentPlans.create({
    name: planName,
    product: product
  });
}

function createProductBillingCycle(
  unitPrice: number,
  term: "MONTHLY" | "YEARLY",
  paymentPlan: ProductPaymentPlans,
  product: Products
): ProductBillingCycles {
  return ProductBillingCycles.create({
    unitPrice: unitPrice,
    term: term,
    isPerUser: 1,
    adminComment: "Auto-generated from integration",
    paymentPlan: paymentPlan,
    product: product
  });
}
