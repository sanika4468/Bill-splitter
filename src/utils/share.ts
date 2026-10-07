import { CalculationResult, BillState } from '../types';
import { formatMoney } from './currency';

export function generateTextSummary(state: BillState, result: CalculationResult): string {
  const payer = state.payerMemberId
    ? state.members.find((m) => m.id === state.payerMemberId)
    : null;

  const cur = state.currencyCode || 'INR';

  let lines: string[] = [];
  lines.push(`🍽️ *${state.title}*`);
  lines.push(`📅 ${new Date(state.createdAt).toLocaleDateString()} · TableTally`);
  lines.push('────────────────────────');
  lines.push(`Food & Drinks: ${formatMoney(result.subtotal, cur)}`);
  if (result.taxAmount > 0) {
    lines.push(`Tax (${result.effectiveTaxRate.toFixed(1)}%): ${formatMoney(result.taxAmount, cur)}`);
  }
  lines.push(`Tip/Gratuity: ${formatMoney(result.totalTipAmount, cur)}`);
  lines.push(`*Total Bill: ${formatMoney(result.grandTotal, cur)}*`);
  lines.push('────────────────────────');
  lines.push(`👥 *EACH FRIEND PAYS:*`);

  result.memberBreakdowns.forEach((mb) => {
    const tipTag = mb.member.useCustomTip
      ? `(custom ${mb.tipPercentUsed}% tip)`
      : `(${mb.tipPercentUsed}% tip)`;
    lines.push(`• *${mb.member.name}*: ${formatMoney(mb.finalTotal, cur)} ${tipTag}`);
  });

  if (payer && result.settlements.length > 0) {
    lines.push('────────────────────────');
    lines.push(`💳 *SETTLEMENT (Paid by ${payer.name}):*`);
    result.settlements.forEach((s) => {
      lines.push(`👉 ${s.fromMemberName} ➜ Pay ${s.toMemberName}: ${formatMoney(s.amount, cur)}`);
    });
  }

  lines.push('────────────────────────');
  lines.push(`⚡ Settle up fast with TableTally`);

  return lines.join('\n');
}

export async function shareSummary(
  state: BillState,
  result: CalculationResult,
  shareUrl: string
): Promise<{ success: boolean; method: 'native' | 'clipboard' }> {
  const text = generateTextSummary(state, result);

  if (navigator.share) {
    try {
      await navigator.share({
        title: `Dinner Bill: ${state.title}`,
        text: `${text}\n\nView bill online:\n${shareUrl}`,
      });
      return { success: true, method: 'native' };
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Native share failed, fallback to clipboard', err);
      }
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n\nView bill: ${shareUrl}`);
    return { success: true, method: 'clipboard' };
  } catch (err) {
    console.error('Clipboard copy failed', err);
    return { success: false, method: 'clipboard' };
  }
}
