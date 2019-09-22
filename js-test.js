const orderSells = [
  {
    _id: 1,
    customer: [
      {
        _id: 22,
        firstname: 'john',
        lastname: 'sus'
      },
      {
        _id: 23,
        firstname: 'sara',
        lastname: 'ss'
      }
    ],
    quantity: 10
  },
  {
    _id: 2,
    customer: [
      {
        _id: 24,
        firstname: 'nong',
        lastname: 'nong'
      },
      {
        _id: 25,
        firstname: 'jeab',
        lastname: 'jeab'
      }
    ],
    quantity: 20
  },
  {
    _id: 3,
    customer: [
      {
        _id: 26,
        firstname: 'nom',
        lastname: 'nom'
      },
      {
        _id: 27,
        firstname: 'jiporn',
        lastname: 'jipon'
      }
    ],
    quantity: 30
  }
];

// const result = orderSells.map(order => {
//   return order.customer.find(c => {
//     return c._id === 23;
//   })
// });

for (const order of orderSells) {
  const result = order.customer.find(c => c._id === 27);
  if(result){
    console.log(result);
  }
}

// console.log(result);