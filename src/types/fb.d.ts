interface FBProducts {
  documents: [
    {
      name: string;
      fields: FBProduct;
    },
  ];
}

interface FBProduct {
  code: FBStringValue;
  description: FBStringValue;
  media: {
    arrayValue: {
      values: [
        {
          mapValue: {
            fields: {
              hash_sha256: FBStringValue;
              filetype: FBStringValue;
              product_id: FBIntegerValue;
              hash_md5: FBStringValue;
              name: FBStringValue;
              hash_crc32c: FBStringValue;
              filesize: FBIntegerValue;
              asset_id: FBIntegerValue;
              sort_order: FBIntegerValue;
              url: FBStringValue;
            };
          };
        },
      ];
    };
  };

  title: FBStringValue;
  price_min: FBIntegerValue;
  eligibility_restriction_text: FBNullValue;
  tags: {
    arrayValue: {
      values: [FBIntegerValue];
    };
  };
  product_id: FBIntegerValue;
  id: FBIntegerValue;
  sort_order: FBIntegerValue;
  price_max: FBIntegerValue;
  is_eligibility_restricted: FBStringValue;
  variants: {
    arrayValue: {
      values: [
        {
          mapValue: {
            fields: {
              stock_status: FBStringValue;
              variant_id: FBIntegerValue;
              code: FBStringValue;
              price: FBIntegerValue;
              product_id: FBIntegerValue;
              title: FBStringValue;
              sort_order: FBIntegerValue;
              tags: {
                arrayValue: {
                  values: [FBIntegerValue];
                };
              };
            };
          };
        },
      ];
    };
  };
}

interface FBStringValue {
  stringValue: string;
}

interface FBIntegerValue {
  integerValue: number;
}

interface FBNullValue {
  nullValue: null;
}
