"use client";

import { useQuery } from "@tanstack/react-query";
import { getBannersService } from "@/services/banner.service";

export const useGetBanners = () =>
  useQuery({
    queryKey: ["banners"],
    queryFn: getBannersService,
  });
