import { PrismaClient, OrderStatus, InformationType } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to generate multilingual names easily
const createNames = (base: string) => ({
  englishName: base,
  arabicName: `${base} (AR)`,
  urduName: `${base} (UR)`,
  hindiName: `${base} (HI)`,
  bengaliName: `${base} (BN)`,
});

async function main() {
  console.log('Start seeding ...');

  // 1. CLEANUP: Delete existing data to prevent unique constraint errors or duplicates
  //    (Deleted in reverse order of dependencies)
  await prisma.orderItemAlterationInformation.deleteMany();
  await prisma.orderItemAlteration.deleteMany();
  await prisma.orderItemSection.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.customOrderItem.deleteMany();
  await prisma.order.deleteMany();
  console.log('Previous data cleared.');

  const ordersData = [
    // ORDER 1: Standard Suit Adjustment (Pending)
    {
      customerId: 'cust_001',
      reference: 'ORD-2024-001',
      status: OrderStatus.pending,
      totalPrice: 45.0,
      items: {
        create: [
          {
            ...createNames("Men's 2-Piece Suit"),
            price: 0,
            imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
            sections: {
              create: [
                {
                  ...createNames('Jacket'),
                  imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
                  coordinates: [
                    { x: 50, y: 100 },
                    { x: 200, y: 100 },
                  ],
                  alterations: {
                    create: [
                      {
                        ...createNames('Shorten Sleeves'),
                        price: 25.0,
                        customCoordinates: [{ x: 60, y: 110 }],
                        informations: {
                          create: [
                            {
                              ...createNames('Amount'),
                              type: InformationType.number,
                              value: '2',
                              unit: 'cm',
                            },
                            {
                              ...createNames('Style'),
                              type: InformationType.select_menu,
                              value: 'Original Hem',
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  ...createNames('Trousers'),
                  imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
                  coordinates: [{ x: 50, y: 300 }],
                  alterations: {
                    create: [
                      {
                        ...createNames('Waist Take-in'),
                        price: 20.0,
                        customCoordinates: [{ x: 55, y: 310 }],
                        informations: {
                          create: [
                            {
                              ...createNames('Measurement'),
                              type: InformationType.number,
                              value: '1.5',
                              unit: 'inch',
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },

    // ORDER 2: Traditional Dress (In Progress)
    {
      customerId: 'cust_002',
      reference: 'ORD-2024-002',
      status: OrderStatus.inProgress,
      totalPrice: 30.0,
      items: {
        create: [
          {
            ...createNames('Traditional Thobe'),
            price: 0,
            imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
            sections: {
              create: [
                {
                  ...createNames('Main Body'),
                  imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
                  coordinates: [{ x: 100, y: 100 }],
                  alterations: {
                    create: [
                      {
                        ...createNames('Shorten Length'),
                        price: 30.0,
                        customCoordinates: [],
                        informations: {
                          create: [
                            {
                              ...createNames('Length to remove'),
                              type: InformationType.number,
                              value: '3',
                              unit: 'cm',
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },

    // ORDER 3: Custom Item Repair
    {
      customerId: 'cust_003',
      reference: 'ORD-2024-003',
      status: OrderStatus.waitingForPickup,
      totalPrice: 50.0,
      customItems: {
        create: [
          {
            price: 50.0,
            imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
            alterations: {
              create: [
                {
                  ...createNames('Patch Repair'),
                  price: 50.0,
                  customCoordinates: [{ x: 500, y: 500 }],
                  informations: {
                    create: [
                      {
                        ...createNames('Note'),
                        type: InformationType.text,
                        value: 'Large tear on the back left shoulder',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },

    // ORDER 4: Wedding Dress
    {
      customerId: 'cust_004',
      reference: 'ORD-2024-004',
      status: OrderStatus.completed,
      totalPrice: 150.0,
      items: {
        create: [
          {
            ...createNames('Wedding Gown'),
            price: 0,
            imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
            sections: {
              create: [
                {
                  ...createNames('Bodice'),
                  imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
                  coordinates: [],
                  alterations: {
                    create: [
                      {
                        ...createNames('Take in sides'),
                        price: 80.0,
                        customCoordinates: [],
                        informations: {
                          create: [
                            {
                              ...createNames('Pinning done?'),
                              type: InformationType.checkbox,
                              value: 'true',
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  ...createNames('Skirt'),
                  imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
                  coordinates: [],
                  alterations: {
                    create: [
                      {
                        ...createNames('Hemming layers'),
                        price: 70.0,
                        customCoordinates: [],
                        informations: {
                          create: [
                            {
                              ...createNames('Layers'),
                              type: InformationType.number,
                              value: '3',
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },

    // ORDER 5: T-Shirt (FIXED: informations: { create: [] })
    {
      customerId: 'cust_005',
      reference: 'ORD-2024-005',
      status: OrderStatus.pending,
      totalPrice: 10.0,
      items: {
        create: [
          {
            ...createNames('Cotton T-Shirt'),
            price: 0,
            imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
            sections: {
              create: [
                {
                  ...createNames('Neck'),
                  imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
                  coordinates: [{ x: 10, y: 10 }],
                  alterations: {
                    create: [
                      {
                        ...createNames('Fix loose stitching'),
                        price: 10.0,
                        customCoordinates: [],
                        informations: { create: [] }, // <--- FIX HERE
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },

    // ORDER 6: Mixed Order (FIXED: informations: { create: [] })
    {
      customerId: 'cust_006',
      reference: 'ORD-2024-006',
      status: OrderStatus.inProgress,
      totalPrice: 65.0,
      items: {
        create: [
          {
            ...createNames('Jeans'),
            price: 0,
            imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
            sections: {
              create: [
                {
                  ...createNames('Legs'),
                  imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
                  coordinates: [],
                  alterations: {
                    create: [
                      {
                        ...createNames('Original Hem'),
                        price: 25.0,
                        customCoordinates: [],
                        informations: { create: [] },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      customItems: {
        create: [
          {
            price: 40.0,
            imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
            alterations: {
              create: [
                {
                  ...createNames('Zipper Replacement'),
                  price: 40.0,
                  customCoordinates: [],
                  informations: { create: [] },
                },
              ],
            },
          },
        ],
      },
    },

    // ORDER 7: Curtains
    {
      customerId: 'cust_007',
      reference: 'ORD-2024-007',
      status: OrderStatus.waitingForPickup,
      totalPrice: 60.0,
      customItems: {
        create: [
          {
            price: 60.0,
            imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
            alterations: {
              create: [
                {
                  ...createNames('Shorten Curtains'),
                  price: 60.0,
                  customCoordinates: [],
                  informations: {
                    create: [
                      {
                        ...createNames('Width'),
                        type: InformationType.number,
                        value: '200',
                        unit: 'cm',
                      },
                      {
                        ...createNames('Lining'),
                        type: InformationType.checkbox,
                        value: 'true',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },

    // ORDER 8: Blazer + Shirt (FIXED: informations: { create: [] })
    {
      customerId: 'cust_008',
      reference: 'ORD-2024-008',
      status: OrderStatus.pending,
      totalPrice: 55.0,
      items: {
        create: [
          {
            ...createNames('Blazer'),
            price: 0,
            imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
            sections: {
              create: [
                {
                  ...createNames('Sleeves'),
                  imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
                  coordinates: [],
                  alterations: {
                    create: [
                      {
                        ...createNames('Lengthen'),
                        price: 30.0,
                        customCoordinates: [],
                        informations: { create: [] },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            ...createNames('Dress Shirt'),
            price: 0,
            imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
            sections: {
              create: [
                {
                  ...createNames('Body'),
                  imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
                  coordinates: [],
                  alterations: {
                    create: [
                      {
                        ...createNames('Add Darts'),
                        price: 25.0,
                        customCoordinates: [],
                        informations: { create: [] },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },

    // ORDER 9: Leather Jacket
    {
      customerId: 'cust_009',
      reference: 'ORD-2024-009',
      status: OrderStatus.inProgress,
      totalPrice: 120.0,
      customItems: {
        create: [
          {
            price: 120.0,
            imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
            alterations: {
              create: [
                {
                  ...createNames('Replace Lining'),
                  price: 120.0,
                  customCoordinates: [],
                  informations: {
                    create: [
                      {
                        ...createNames('Fabric Color'),
                        type: InformationType.select_menu,
                        value: 'Black Silk',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },

    // ORDER 10: Button
    {
      customerId: 'cust_010',
      reference: 'ORD-2024-010',
      status: OrderStatus.completed,
      totalPrice: 5.0,
      items: {
        create: [
          {
            ...createNames('Coat'),
            price: 0,
            imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
            sections: {
              create: [
                {
                  ...createNames('Front'),
                  imageFileId: '5ce2c874-911f-4bbe-b33d-c2d71dc889ac.png',
                  coordinates: [],
                  alterations: {
                    create: [
                      {
                        ...createNames('Sew Button'),
                        price: 5.0,
                        customCoordinates: [{ x: 300, y: 400 }],
                        informations: {
                          create: [
                            {
                              ...createNames('Button Provided?'),
                              type: InformationType.checkbox,
                              value: 'true',
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ];

  for (const orderData of ordersData) {
    const order = await prisma.order.create({
      data: orderData,
    });
    console.log(`Created order with id: ${order.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
