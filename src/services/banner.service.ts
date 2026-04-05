import _axios from "@/lib/axios";
import type { BannersResponse } from "@/types";

export const getBannersService = () =>
  _axios<BannersResponse>("GET", "/banners");
