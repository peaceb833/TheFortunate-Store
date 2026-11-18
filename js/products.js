/* Your catalogue. To add a product, copy a line and edit it.
   cat: clothing | shoes | bags | belts | ties | hats
   gender: men | women | unisex
   image: optional. Put a photo in an "images" folder and write "images/name.jpg".
   Without a photo, the shop shows a clean illustrated tile. */
window.PRODUCTS = [
  // Clothing
  { id:"c1", name:"Tailored Linen Shirt", cat:"clothing", gender:"men", price:28500, tone:["#DCE3F4","#B9C6E6"], colors:["White","Sky blue","Navy"], sizes:["S","M","L","XL","XXL"], desc:"Breathable linen shirt with a clean collar and a relaxed, tailored fit. Easy to wear to work or on weekends.", featured:true },
  { id:"c2", name:"Slim Fit Chinos", cat:"clothing", gender:"men", price:32000, tone:["#EADFC8","#D6C29A"], colors:["Sand","Navy","Charcoal"], sizes:["30","32","34","36","38"], desc:"Stretch cotton chinos with a slim leg. Sharp enough for the office, comfortable enough for the weekend." },
  { id:"c3", name:"Classic Two-Piece Suit", cat:"clothing", gender:"men", price:145000, tone:["#27345C","#101B3A"], colors:["Navy","Charcoal","Black"], sizes:["46","48","50","52","54"], desc:"A structured two-piece suit in a fine wool blend, fully lined, cut to hold its shape all day.", featured:true },
  { id:"c4", name:"Ankara Print Shirt", cat:"clothing", gender:"men", price:36000, tone:["#E9C97A","#C69A3E"], colors:["Gold print","Blue print"], sizes:["S","M","L","XL","XXL"], desc:"Bold African print on soft cotton. Made to be noticed at weddings, parties and Fridays." },
  { id:"c5", name:"Wrap Midi Dress", cat:"clothing", gender:"women", price:42000, tone:["#E7CFE0","#C99BB9"], colors:["Plum","Navy","Ivory"], sizes:["XS","S","M","L","XL"], desc:"A flattering wrap dress that falls just below the knee. Ties at the waist so it fits the way you want.", featured:true },
  { id:"c6", name:"Satin Pleated Skirt", cat:"clothing", gender:"women", price:26500, tone:["#EBD7E4","#D3AAC4"], colors:["Champagne","Plum","Black"], sizes:["XS","S","M","L","XL"], desc:"Fluid satin skirt with fine pleats that move when you do. Pairs with a tee or a blazer." },
  { id:"c7", name:"Structured Blazer", cat:"clothing", gender:"women", price:58000, tone:["#D5D9E6","#A9B0C9"], colors:["Black","Cream","Navy"], sizes:["XS","S","M","L","XL"], desc:"Sharp shoulders, a nipped waist and a lined interior. The one piece that finishes any outfit." },
  { id:"c8", name:"Silk-Touch Blouse", cat:"clothing", gender:"women", price:31000, tone:["#F0E1D0","#DCC09D"], colors:["Ivory","Gold","Plum"], sizes:["XS","S","M","L","XL"], desc:"Soft, smooth blouse with a relaxed neckline. Looks dressed up and feels like nothing." },

  // Shoes
  { id:"s1", name:"Leather Oxford Shoes", cat:"shoes", gender:"men", price:68000, tone:["#3A2B25","#1F1613"], colors:["Black","Brown"], sizes:["40","41","42","43","44","45"], desc:"Hand-finished leather oxfords with a cushioned insole and a durable sole. Built for long days.", featured:true },
  { id:"s2", name:"Suede Loafers", cat:"shoes", gender:"men", price:52000, tone:["#C9B28F","#A58C64"], colors:["Tan","Navy","Black"], sizes:["40","41","42","43","44","45"], desc:"Slip-on suede loafers, soft from the first wear. Smart with trousers, easy with shorts." },
  { id:"s3", name:"Minimal White Sneakers", cat:"shoes", gender:"unisex", price:38000, tone:["#EDEFF5","#CFD4E3"], colors:["White","Off-white"], sizes:["37","38","39","40","41","42","43","44"], desc:"Clean leather sneakers that go with everything you own. Wipe clean and they look new again." },
  { id:"s4", name:"Block Heel Sandals", cat:"shoes", gender:"women", price:41000, tone:["#EBD7E4","#C99BB9"], colors:["Nude","Black","Gold"], sizes:["36","37","38","39","40","41"], desc:"A stable block heel you can actually dance in. Padded straps, secure ankle buckle.", featured:true },
  { id:"s5", name:"Pointed Court Heels", cat:"shoes", gender:"women", price:46000, tone:["#27345C","#101B3A"], colors:["Black","Plum","Nude"], sizes:["36","37","38","39","40","41"], desc:"Classic pointed pumps with a mid-height heel and a cushioned footbed. Day to night." },

  // Bags
  { id:"b1", name:"Leather Tote Bag", cat:"bags", gender:"women", price:64000, tone:["#EADFC8","#C69A3E"], colors:["Tan","Black","Plum"], sizes:["One size"], desc:"Roomy structured tote that fits a laptop, a lunch and everything else. Zip top, inner pocket.", featured:true },
  { id:"b2", name:"Mini Crossbody Bag", cat:"bags", gender:"women", price:34000, tone:["#EBD7E4","#B77CA3"], colors:["Black","Gold","Plum"], sizes:["One size"], desc:"Small enough for the essentials, with an adjustable chain strap you can wear two ways." },
  { id:"b3", name:"Executive Briefcase", cat:"bags", gender:"men", price:78000, tone:["#3A2B25","#1F1613"], colors:["Black","Brown"], sizes:["One size"], desc:"Firm leather briefcase with a padded laptop sleeve and a lockable clasp." },
  { id:"b4", name:"Canvas Weekender", cat:"bags", gender:"unisex", price:45000, tone:["#D5D9E6","#8C97BB"], colors:["Navy","Sand"], sizes:["One size"], desc:"A sturdy weekend bag with leather handles and a wide opening. Packs a few days without a fuss." },

  // Belts
  { id:"t1", name:"Classic Leather Belt", cat:"belts", gender:"men", price:15000, tone:["#3A2B25","#1F1613"], colors:["Black","Brown"], sizes:["32","34","36","38","40","42"], desc:"Full-grain leather with a brushed silver buckle. Gets better with age." },
  { id:"t2", name:"Reversible Dress Belt", cat:"belts", gender:"men", price:18500, tone:["#27345C","#101B3A"], colors:["Black / Brown"], sizes:["32","34","36","38","40","42"], desc:"Two belts in one. Twist the buckle to switch between black and brown." },
  { id:"t3", name:"Gold Buckle Waist Belt", cat:"belts", gender:"women", price:14000, tone:["#F0E1D0","#C69A3E"], colors:["Black","Tan","Plum"], sizes:["S","M","L"], desc:"Slim belt with a gold buckle to define the waist on dresses, coats and wide trousers." },

  // Ties
  { id:"w1", name:"Silk Tie", cat:"ties", gender:"men", price:12000, tone:["#27345C","#101B3A"], colors:["Navy","Plum","Gold"], sizes:["One size"], desc:"Pure silk with a subtle woven pattern. Holds a good knot and doesn't crease easily." },
  { id:"w2", name:"Bow Tie Set", cat:"ties", gender:"men", price:16500, tone:["#E7CFE0","#7A2E57"], colors:["Plum","Black","Navy"], sizes:["One size"], desc:"Pre-tied adjustable bow tie with a matching pocket square. Ready in ten seconds." },

  // Hats
  { id:"h1", name:"Wool Fedora", cat:"hats", gender:"men", price:22000, tone:["#D5D9E6","#27345C"], colors:["Charcoal","Navy","Camel"], sizes:["M","L","XL"], desc:"Structured wool fedora with a grosgrain band. A finishing touch with real presence." },
  { id:"h2", name:"Wide Brim Sun Hat", cat:"hats", gender:"women", price:19500, tone:["#F0E1D0","#DCC09D"], colors:["Natural","Black"], sizes:["One size"], desc:"A wide, light brim for sunny days and beach weekends. Folds flat and keeps its shape." },
  { id:"h3", name:"Everyday Cap", cat:"hats", gender:"unisex", price:9500, tone:["#CFD4E3","#8C97BB"], colors:["Navy","Black","Stone"], sizes:["One size"], desc:"Soft cotton cap with an adjustable strap and a curved brim. Goes with anything." }
];
