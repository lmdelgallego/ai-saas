import { inngest } from "@/lib/inngest/client";
import { createClient } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const { categories, frequency, email } = body;

  if(!categories || !Array.isArray(categories) || categories.length === 0) {
    return NextResponse.json(
      { error: 'Categories array is required and must have at least one category' },
      { status: 400 }
    );
  }

  if(!frequency || !['daily','weekly', 'bi-weekly'].includes(frequency)) {
    return NextResponse.json(
      { error: 'Frequency is required and must be weekly, monthly or yearly' },
      { status: 400 }
    );
  }

  const { data, error: upsertError } = await supabase.from('user_preferences').upsert({
    user_id: user.id,
    categories,
    frequency,
    email,
    is_active: true
  }, {onConflict: 'user_id'})

  if(upsertError) {
    console.error('Error saving user preferences:', upsertError);
    return NextResponse.json(
      { error: 'Failed to save user preferences' },
      { status: 500 }
    );
  }

  await inngest.send({
    name: 'newsletter.scheduled',
    data: {}
  })

  return NextResponse.json(
    {
      success: true,
      message: 'User preferences saved successfully'
    },
    { status: 200 }
  );
}
