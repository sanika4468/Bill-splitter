import { BillState, CalculationResult, MemberBreakdown, RoundingMode } from '../types';

export function roundAmount(amount: number, mode: RoundingMode): number {
  if (mode === 'dollar') {
    return Math.ceil(amount);
  }
  if (mode === 'half_dollar') {
    return Math.ceil(amount * 2) / 2;
  }
  return Math.round(amount * 100) / 100;
}

export function calculateBill(state: BillState): CalculationResult {
  const {
    totalBillAmount,
    billCalculationMode,
    taxMode,
    taxPercent,
    taxFixedAmount,
    groupTipPercent,
    tipIncludedInTotal,
    roundingMode,
    payerMemberId,
    members,
    items,
  } = state;

  if (members.length === 0) {
    return {
      subtotal: 0,
      taxAmount: 0,
      effectiveTaxRate: 0,
      totalTipAmount: 0,
      grandTotal: 0,
      roundingDelta: 0,
      memberBreakdowns: [],
      settlements: [],
    };
  }

  let rawSubtotal = 0;
  const memberItemSubtotals: Record<string, number> = {};
  const memberAssignedItems: Record<string, { name: string; sharePrice: number }[]> = {};

  members.forEach((m) => {
    memberItemSubtotals[m.id] = 0;
    memberAssignedItems[m.id] = [];
  });

  if (billCalculationMode === 'direct_total') {
    // User directly wrote the Total Bill Amount!
    rawSubtotal = Math.max(0, totalBillAmount);
    const equalShare = members.length > 0 ? rawSubtotal / members.length : 0;
    members.forEach((m) => {
      memberItemSubtotals[m.id] = equalShare;
      memberAssignedItems[m.id] = [
        { name: 'Equal share of bill', sharePrice: equalShare },
      ];
    });
  } else {
    // Itemized mode: sum from individual items
    items.forEach((item) => {
      const lineCost = Math.max(0, item.price) * Math.max(1, item.quantity);
      rawSubtotal += lineCost;

      const activeAssignees =
        item.assignedMemberIds.length > 0
          ? item.assignedMemberIds.filter((id) => members.some((m) => m.id === id))
          : members.map((m) => m.id);

      const splitCount = activeAssignees.length > 0 ? activeAssignees.length : members.length;
      const sharePrice = splitCount > 0 ? lineCost / splitCount : 0;

      const targetIds = activeAssignees.length > 0 ? activeAssignees : members.map((m) => m.id);
      targetIds.forEach((mId) => {
        if (memberItemSubtotals[mId] !== undefined) {
          memberItemSubtotals[mId] += sharePrice;
          memberAssignedItems[mId].push({
            name: `${item.name}${item.quantity > 1 ? ` (x${item.quantity})` : ''}`,
            sharePrice,
          });
        }
      });
    });
  }

  // 2. Tax Calculation
  let taxAmount = 0;
  let effectiveTaxRate = 0;

  if (taxMode === 'percent') {
    taxAmount = (rawSubtotal * Math.max(0, taxPercent)) / 100;
    effectiveTaxRate = taxPercent;
  } else if (taxMode === 'fixed') {
    taxAmount = Math.max(0, taxFixedAmount);
    effectiveTaxRate = rawSubtotal > 0 ? (taxAmount / rawSubtotal) * 100 : 0;
  } else {
    // taxMode === 'none' (already in total or zero)
    taxAmount = 0;
    effectiveTaxRate = 0;
  }

  // 3. Tip Calculation & Member Breakdowns
  let totalTip = 0;
  let totalRawSum = 0;
  let totalRoundedSum = 0;

  const memberBreakdowns: MemberBreakdown[] = members.map((member) => {
    const itemSubtotal = memberItemSubtotals[member.id] || 0;

    // Distribute tax proportionally
    const taxShare =
      rawSubtotal > 0 ? (itemSubtotal / rawSubtotal) * taxAmount : taxAmount / members.length;

    // Tip percentage
    let tipPercentUsed = 0;
    let tipShare = 0;

    if (!tipIncludedInTotal) {
      tipPercentUsed =
        member.useCustomTip && member.customTipPercent !== undefined
          ? Math.max(0, member.customTipPercent)
          : Math.max(0, groupTipPercent);

      tipShare = (itemSubtotal * tipPercentUsed) / 100;
      totalTip += tipShare;
    }

    const rawTotal = itemSubtotal + taxShare + tipShare;
    const finalTotal = roundAmount(rawTotal, roundingMode);

    totalRawSum += rawTotal;
    totalRoundedSum += finalTotal;

    return {
      member,
      itemSubtotal,
      taxShare,
      tipPercentUsed,
      tipShare,
      rawTotal,
      finalTotal,
      assignedItems: memberAssignedItems[member.id] || [],
      netBalance: 0,
    };
  });

  const grandTotal = totalRoundedSum;
  const roundingDelta = totalRoundedSum - totalRawSum;

  // 4. Settlement Matrix
  const payer = payerMemberId ? members.find((m) => m.id === payerMemberId) : null;
  const settlements: CalculationResult['settlements'] = [];

  if (payer) {
    memberBreakdowns.forEach((mb) => {
      if (mb.member.id === payer.id) {
        mb.netBalance = grandTotal - mb.finalTotal;
      } else {
        mb.netBalance = -mb.finalTotal;
        if (mb.finalTotal > 0) {
          settlements.push({
            fromMemberId: mb.member.id,
            fromMemberName: mb.member.name,
            toMemberId: payer.id,
            toMemberName: payer.name,
            amount: mb.finalTotal,
          });
        }
      }
    });
  }

  return {
    subtotal: rawSubtotal,
    taxAmount,
    effectiveTaxRate,
    totalTipAmount: totalTip,
    grandTotal,
    roundingDelta,
    memberBreakdowns,
    settlements,
  };
}
