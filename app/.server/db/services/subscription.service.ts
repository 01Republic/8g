import { AppDataSource, Organizations } from '../index'
import { Subscriptions } from '../entities/Subscriptions'
import { SubscriptionSeats } from '../entities/SubscriptionSeats'

export interface WorkspaceData {
  uid: string
  provider: string
  content: string
}

export interface MemberData {
  email: string
  status: string
  joinDate: string
}

export interface SubscriptionData {
  workspace: WorkspaceData
  members: MemberData[]
  organizationId: number
  productId: number
}

export class SubscriptionService {

  async saveSubscription(data: SubscriptionData): Promise<{ subscriptionId: number; savedSeats: number }> {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()


    try {
      // 1. Find organization
      const organization = await queryRunner.manager.findOne(Organizations, {
        where: {
          id: data.organizationId
        }
      })

      if(!organization) {
        throw new Error("not found organization")
      }

      // 2. Create Subscription for Slack workspace
      const subscription = Subscriptions.create({
        productId: data.productId,
        organization: organization, // Set organization relationship instead of organizationId
        connectMethod: 'MANUAL',
        accountCount: data.members.length,
        usedMemberCount: data.members.length,
        paidMemberCount: data.members.filter(m => m.status === 'active').length,
        status: 'PAYMENT_SUCCESS',
        connectStatus: 'SUCCESS',
        pricingModel: 'PER_SEAT',
        isPerUser: 1,
        registeredAt: new Date(),
      })

      const savedSubscription = await queryRunner.manager.save(subscription)

      // 3. Create SubscriptionSeats for each member
      let savedSeats = 0
      for (const member of data.members) {
        // Create subscription seat
        const subscriptionSeat = SubscriptionSeats.create({
          subscriptionId: savedSubscription.id,
          teamMemberId: null,
          status: member.status === 'active' ? 'PAID' : 'QUIT',
          isPaid: member.status === 'active' ? 1 : 0,
          startAt: member.joinDate ? new Date(member.joinDate) : new Date(),
        })

        await queryRunner.manager.save(subscriptionSeat)
        savedSeats++
      }

      await queryRunner.commitTransaction()

      return {
        subscriptionId: savedSubscription.id,
        savedSeats
      }

    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async getSlackSubscription(subscriptionId: number): Promise<Subscriptions | null> {
    return await AppDataSource.manager.findOne(Subscriptions, {
      where: { id: subscriptionId },
      relations: ['subscriptionSeats', 'subscriptionSeats.teamMember', 'product']
    })
  }
}