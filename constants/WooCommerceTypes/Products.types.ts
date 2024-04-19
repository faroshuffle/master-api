interface ProductType {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  description: string;
  permalink: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from?: any;
  date_on_sale_from_gmt?: any;
  date_on_sale_to?: any;
  date_on_sale_to_gmt?: any;
  on_sale: boolean;
  status: string;
  purchasable: boolean;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[];
  download_limit: number;
  download_expiry: number;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity?: any;
  stock_status: string;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount?: any;
  weight: string;
  dimensions: Dimensions;
  shipping_class: string;
  shipping_class_id: number;
  image: Image;
  attributes: Attribute[];
  menu_order: number;
  meta_data: Metadatum[];
  name: string;
  parent_id: number;
  _links: Links;
}
interface Links {
  self: Self[];
  collection: Self[];
  up: Self[];
}
interface Self {
  href: string;
}
interface Metadatum {
  id: number;
  key: string;
  value: string;
}
interface Attribute {
  id: number;
  name: string;
  slug: string;
  option: string;
}
interface Image {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
}
interface Dimensions {
  length: string;
  width: string;
  height: string;
}
