import { inngest } from "@/lib/inngest/client";
import { createClient } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
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
    data: {
      email,
      frequency,
      categories
    }
  })

  return NextResponse.json(
    {
      success: true,
      message: 'User preferences saved successfully'
    },
    { status: 200 }
  );
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { data: preferences, error: fetchError } = await supabase.from('user_preferences').select('*').eq('user_id', user.id).single();

    if(fetchError) {
      console.error('Error fetching user preferences:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch user preferences' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        preferences
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }

}

export async function UPDATE(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            {error: 'Unauthorized'},
            { status: 401 }
        )
    }

    try {
        const body = await req.json();
        const { active } = body;
    }
    catch (error) {
        console.error('Error fetching user preferences:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}