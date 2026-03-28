"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

interface RealtimeQuerySyncProps {
  userId: string;
  tables: string[];
  queryKeys: ReadonlyArray<ReadonlyArray<unknown>>;
}

export function RealtimeQuerySync({
  userId,
  tables,
  queryKeys,
}: RealtimeQuerySyncProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isSupabaseConfigured() || !userId || tables.length === 0) return;

    const supabase = createSupabaseBrowserClient();
    const channel = supabase.channel(`sync:${tables.join("-")}:${userId}`);

    tables.forEach((table) => {
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryKeys.forEach((key) => {
            queryClient.invalidateQueries({ queryKey: [...key] });
          });
        }
      );
    });

    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, queryKeys, tables, userId]);

  return null;
}
