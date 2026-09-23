import { NextRequest, NextResponse } from 'next/server';
import { askAIAstrologer } from '@/lib/geminiAstrologer';
import { NatalChartData } from '@/types/astro';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, chart, history, locale } = body as {
      question: string;
      chart: NatalChartData;
      history: { role: 'user' | 'model'; text: string }[];
      locale?: any;
    };

    if (!question || !chart) {
      return NextResponse.json(
        { error: 'Missing question or natal chart data' },
        { status: 400 }
      );
    }

    const answer = await askAIAstrologer(question, chart, history || [], locale || 'ru');
    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error('Astrologer API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal error' },
      { status: 500 }
    );
  }
}
