import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Card } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Link } from "react-router";
import type { AppDetailResponseDto } from "~/routes/dto/app";
import {
  ArrowLeft,
  Users,
  CreditCard,
  Calendar,
  TrendingUp,
  Building,
  Mail,
  ExternalLink,
} from "lucide-react";

interface AppDetailPageProps {
  appDetail: AppDetailResponseDto;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    PAYMENT_SUCCESS: { label: "활성", color: "bg-green-100 text-green-800" },
    PAYMENT_PENDING: {
      label: "대기중",
      color: "bg-yellow-100 text-yellow-800",
    },
    PAYMENT_FAILURE: { label: "실패", color: "bg-red-100 text-red-800" },
    FREE_TRIAL_STARTED: {
      label: "무료 체험",
      color: "bg-blue-100 text-blue-800",
    },
    FREE_TRIAL_EXPIRED: {
      label: "체험 만료",
      color: "bg-gray-100 text-gray-800",
    },
    NONE: { label: "없음", color: "bg-gray-100 text-gray-800" },
  } as const;

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    color: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
};

const getConnectStatusBadge = (status: string) => {
  const statusConfig = {
    SUCCESS: { label: "연동 완료", color: "bg-green-100 text-green-800" },
    PENDING: { label: "연동 대기", color: "bg-yellow-100 text-yellow-800" },
    FAILURE: { label: "연동 실패", color: "bg-red-100 text-red-800" },
    APPLIED: { label: "신청됨", color: "bg-blue-100 text-blue-800" },
  } as const;

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    color: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
};

const getMemberStatusBadge = (status: string) => {
  const statusConfig = {
    PAID: { label: "유료", color: "bg-green-100 text-green-800" },
    FREE: { label: "무료", color: "bg-blue-100 text-blue-800" },
    QUIT: { label: "퇴사", color: "bg-gray-100 text-gray-800" },
    NONE: { label: "없음", color: "bg-gray-100 text-gray-800" },
  } as const;

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    color: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
};

const formatCurrency = (amount: number, currency: string = "KRW") => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const formatDate = (date: Date | string | null) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
};

const formatDateTime = (date: Date | string | null) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export default function AppDetailPage({ appDetail }: AppDetailPageProps) {
  return (
    <div className="h-full w-full bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link
            to="/apps"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />앱 목록으로 돌아가기
          </Link>
        </div>

        {/* App Overview Card */}
        <Card className="p-6 mb-6 bg-white shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={appDetail.appLogo}
                  alt={appDetail.appKoreanName}
                />
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {appDetail.appKoreanName}
                </h1>
                <p className="text-lg text-gray-600">
                  {appDetail.appEnglishName}
                </p>
                <div className="flex gap-2 mt-2">
                  {getStatusBadge(appDetail.status)}
                  {getConnectStatusBadge(appDetail.connectStatus)}
                </div>
              </div>
            </div>
          </div>

          {appDetail.description && (
            <p className="mt-4 text-gray-700">{appDetail.description}</p>
          )}
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">총 구성원</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appDetail.usedMemberCount}
                  <span className="text-sm text-gray-500 font-normal">
                    /{appDetail.totalTeamMemberCount}
                  </span>
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">활용률</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appDetail.utilizationRate}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">월 비용</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    appDetail.paymentInfo.currentBillingAmount,
                    appDetail.paymentInfo.currency,
                  )}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">인당 비용</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    appDetail.costPerUser,
                    appDetail.paymentInfo.currency,
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Workspace Info */}
            {appDetail.workspace && (
              <Card className="p-6 bg-white shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  워크스페이스 정보
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {appDetail.workspace.profileImageUrl && (
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={appDetail.workspace.profileImageUrl}
                          alt={appDetail.workspace.displayName}
                        />
                      </Avatar>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {appDetail.workspace.displayName}
                      </p>
                      {appDetail.workspace.description && (
                        <p className="text-sm text-gray-600">
                          {appDetail.workspace.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    {appDetail.workspace.billingEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">결제 이메일</p>
                          <p className="text-sm text-gray-900">
                            {appDetail.workspace.billingEmail}
                          </p>
                        </div>
                      </div>
                    )}
                    {appDetail.workspace.publicEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">공개 이메일</p>
                          <p className="text-sm text-gray-900">
                            {appDetail.workspace.publicEmail}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Members Table */}
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                구성원 목록
                <span className="text-sm font-normal text-gray-500">
                  ({appDetail.seats.length}명)
                </span>
              </h2>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-900">
                        이름
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        이메일
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        상태
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        시작일
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        종료일
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appDetail.seats.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-gray-500"
                        >
                          등록된 구성원이 없습니다
                        </TableCell>
                      </TableRow>
                    ) : (
                      appDetail.seats.map((member) => (
                        <TableRow key={member.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {member.profileImageUrl && (
                                <Avatar className="w-8 h-8">
                                  <AvatarImage
                                    src={member.profileImageUrl}
                                    alt={member.name}
                                  />
                                </Avatar>
                              )}
                              <span>{member.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {member.email}
                          </TableCell>
                          <TableCell>
                            {getMemberStatusBadge(member.status)}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {formatDate(member.startAt)}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {formatDate(member.finishAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Billing History */}
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                결제 내역
              </h2>
              <div className="space-y-3">
                {appDetail.billingHistories.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">
                    결제 내역이 없습니다
                  </p>
                ) : (
                  appDetail.billingHistories.map((history) => (
                    <div
                      key={history.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(history.amount, history.currency)}
                          </p>
                          <span className="text-xs text-gray-500">
                            {history.paymentMethod}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          결제일: {formatDateTime(history.paidAt)}
                        </p>
                        <p className="text-xs text-gray-500">
                          발행일: {formatDate(history.issuedAt)}
                        </p>
                      </div>
                      {history.invoiceUrl && (
                        <a
                          href={history.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm">영수증</span>
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Payment Info */}
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                결제 정보
              </h2>
              <div className="space-y-4">
                {appDetail.paymentInfo.creditCard && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">결제 카드</p>
                    <p className="font-semibold text-gray-900">
                      {appDetail.paymentInfo.creditCard.cardName}
                    </p>
                    <p className="text-sm text-gray-600">
                      **** **** ****{" "}
                      {appDetail.paymentInfo.creditCard.lastFourDigits}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500 mb-1">플랜</p>
                  <p className="font-semibold text-gray-900">
                    {appDetail.paymentInfo.planName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">요금제 모델</p>
                  <p className="font-semibold text-gray-900">
                    {appDetail.paymentInfo.pricingModel}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">결제 주기</p>
                  <p className="font-semibold text-gray-900">
                    {appDetail.paymentInfo.billingCycleType}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-1">다음 결제 예정일</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(appDetail.nextBillingDate)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">다음 결제 금액</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(
                      appDetail.nextBillingAmount,
                      appDetail.paymentInfo.currency,
                    )}
                  </p>
                </div>
              </div>
            </Card>

            {/* Subscription Timeline */}
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                구독 일정
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">등록일</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(appDetail.registeredAt)}
                  </p>
                </div>

                {appDetail.startAt && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">시작일</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(appDetail.startAt)}
                    </p>
                  </div>
                )}

                {appDetail.finishAt && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">종료일</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(appDetail.finishAt)}
                    </p>
                  </div>
                )}

                {appDetail.lastPaidAt && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">최근 결제일</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(appDetail.lastPaidAt)}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Connection Method */}
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                연동 방법
              </h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">
                  {appDetail.connectMethod}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {appDetail.connectMethod === "MANUAL" && "수동 등록"}
                  {appDetail.connectMethod === "G_SUITE" &&
                    "Google Workspace 연동"}
                  {appDetail.connectMethod === "INVOICE" && "인보이스 연동"}
                  {appDetail.connectMethod === "CODEF_CARD" && "카드 자동 연동"}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
