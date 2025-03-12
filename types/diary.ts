interface InfoPoint {
  id: number;
  point_type: "con" | "pro"; // Assuming these are the possible types
  text: string;
  dairy: number;
  brand: number | null;
}

interface Product {
  id: number;
  name: string;
  uses_bovaer: boolean;
  is_organic: boolean;
  country_of_origin: string | null;
  image: string;
  stores: string;
  description: string;
  created_at: string;
  dairy: number;
  local_dairy: number | null;
  brand: number | null;
}

interface Dairy {
  id: number;
  info_points: InfoPoint[];
  sources: string[];
  products: Product[];
  name: string;
  website: string;
  logo: string;
  contact_email: string;
  uses_bovaer: boolean;
  description: string;
  source_description: string;
}

export type { Dairy, InfoPoint, Product };
