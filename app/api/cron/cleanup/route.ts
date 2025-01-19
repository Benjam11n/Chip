import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  try {
    const { error } = await supabase.rpc('cleanup_inactive_games');
    
    if (error) throw error;
    
    return NextResponse.json({ message: "Cleanup successful" });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: "Failed to cleanup games" }, 
      { status: 500 }
    );
  }
}