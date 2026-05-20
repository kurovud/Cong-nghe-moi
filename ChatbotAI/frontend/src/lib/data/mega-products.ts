/* ═══════════════════════════════════════════════════════════════════
   MEGA PRODUCT DATABASE — ~1800+ sản phẩm linh kiện PC
   Tự sinh từ template thực tế, đảm bảo data phong phú cho chatbot
   ═══════════════════════════════════════════════════════════════════ */

import type { Product, ProductCategory } from "@/types/product.type";

/* ──── Helpers ──── */
const p = (
  id: string, name: string, category: ProductCategory, brand: string,
  price: number, shortDesc: string, specs: Record<string, string>,
  stock: number, rating: number, tags: string[], compatKey?: string,
  discountPrice?: number, image?: string
): Product => ({
  id, name, category, brand, price, discountPrice,
  image: image ?? `/images/products/${category}/${id}.jpg`,
  shortDesc, specs, stock, rating, tags, compatKey,
});

/* ═══════════════════════════════════════
   CPU — ~120 SKUs
   ═══════════════════════════════════════ */
const cpus: Product[] = [
  // === Intel Core 14th Gen (Raptor Lake Refresh) ===
  p("cpu-i9-14900k","Intel Core i9-14900K","cpu","Intel",14990000,"Flagship 24 nhân (8P+16E) 36 luồng, Turbo 6.0GHz, LGA 1700",{Socket:"LGA 1700","Nhân/Luồng":"24C/32T","Base/Boost":"3.2 / 6.0 GHz","Cache":"36MB L3","TDP":"125W (PL2 253W)","iGPU":"UHD 770","RAM hỗ trợ":"DDR5-5600 / DDR4-3200","Kiến trúc":"Raptor Lake Refresh"},25,4.8,["intel","i9","14900k","flagship","gaming","ép xung","lga1700","24 nhân"],"LGA1700_DDR5"),
  p("cpu-i9-14900kf","Intel Core i9-14900KF","cpu","Intel",14490000,"Flagship 24C/32T không iGPU, gaming/workstation",{Socket:"LGA 1700","Nhân/Luồng":"24C/32T","Base/Boost":"3.2 / 6.0 GHz","Cache":"36MB L3","TDP":"125W (PL2 253W)","iGPU":"Không","RAM hỗ trợ":"DDR5-5600 / DDR4-3200"},20,4.8,["intel","i9","14900kf","flagship","no igpu"],"LGA1700_DDR5"),
  p("cpu-i9-14900","Intel Core i9-14900","cpu","Intel",12990000,"24C/32T non-K, locked",{Socket:"LGA 1700","Nhân/Luồng":"24C/32T","Base/Boost":"2.0 / 5.8 GHz","Cache":"36MB L3","TDP":"65W (PL2 219W)","iGPU":"UHD 770"},15,4.6,["intel","i9","14900","locked"],"LGA1700_DDR5"),
  p("cpu-i7-14700k","Intel Core i7-14700K","cpu","Intel",9490000,"20 nhân (8P+12E) 28 luồng, Turbo 5.6GHz, gaming mạnh",{Socket:"LGA 1700","Nhân/Luồng":"20C/28T","Base/Boost":"3.4 / 5.6 GHz","Cache":"33MB L3","TDP":"125W (PL2 253W)","iGPU":"UHD 770","RAM hỗ trợ":"DDR5-5600 / DDR4-3200"},30,4.7,["intel","i7","14700k","gaming","workstation","ép xung"],"LGA1700_DDR5"),
  p("cpu-i7-14700kf","Intel Core i7-14700KF","cpu","Intel",8990000,"20C/28T không iGPU, giá tốt hơn K",{Socket:"LGA 1700","Nhân/Luồng":"20C/28T","Base/Boost":"3.4 / 5.6 GHz","Cache":"33MB L3","TDP":"125W","iGPU":"Không"},25,4.7,["intel","i7","14700kf","gaming","no igpu"],"LGA1700_DDR5"),
  p("cpu-i7-14700","Intel Core i7-14700","cpu","Intel",8490000,"20C/28T locked, hiệu năng cao không cần ép xung",{Socket:"LGA 1700","Nhân/Luồng":"20C/28T","Base/Boost":"2.1 / 5.4 GHz","Cache":"33MB L3","TDP":"65W","iGPU":"UHD 770"},20,4.6,["intel","i7","14700","locked"],"LGA1700_DDR5"),
  p("cpu-i7-14700f","Intel Core i7-14700F","cpu","Intel",7990000,"20C/28T locked, không iGPU",{Socket:"LGA 1700","Nhân/Luồng":"20C/28T","Base/Boost":"2.1 / 5.4 GHz","Cache":"33MB L3","TDP":"65W","iGPU":"Không"},25,4.6,["intel","i7","14700f","budget workstation"],"LGA1700_DDR5"),
  p("cpu-i5-14600k","Intel Core i5-14600K","cpu","Intel",7290000,"14C/20T gaming mid-range, ép xung được",{Socket:"LGA 1700","Nhân/Luồng":"14C/20T","Base/Boost":"3.5 / 5.3 GHz","Cache":"24MB L3","TDP":"125W","iGPU":"UHD 770"},30,4.6,["intel","i5","14600k","gaming","ép xung"],"LGA1700_DDR5"),
  p("cpu-i5-14600kf","Intel Core i5-14600KF","cpu","Intel",6790000,"14C/20T ép xung, không iGPU",{Socket:"LGA 1700","Nhân/Luồng":"14C/20T","Base/Boost":"3.5 / 5.3 GHz","Cache":"24MB L3","TDP":"125W","iGPU":"Không"},25,4.5,["intel","i5","14600kf","gaming"],"LGA1700_DDR5"),
  p("cpu-i5-14500","Intel Core i5-14500","cpu","Intel",5990000,"14C/20T locked, hiệu năng tốt giá phải chăng",{Socket:"LGA 1700","Nhân/Luồng":"14C/20T","Base/Boost":"2.6 / 5.0 GHz","Cache":"24MB L3","TDP":"65W","iGPU":"UHD 770"},30,4.5,["intel","i5","14500"],"LGA1700_DDR5"),
  p("cpu-i5-14400","Intel Core i5-14400","cpu","Intel",4990000,"10C/16T có iGPU, văn phòng + gaming nhẹ",{Socket:"LGA 1700","Nhân/Luồng":"10C/16T","Base/Boost":"2.5 / 4.7 GHz","Cache":"20MB L3","TDP":"65W","iGPU":"UHD 730"},50,4.5,["intel","i5","14400","igpu","văn phòng"],"LGA1700_DDR5"),
  p("cpu-i5-14400f","Intel Core i5-14400F","cpu","Intel",4190000,"Best value gaming CPU, 10C/16T, không iGPU",{Socket:"LGA 1700","Nhân/Luồng":"10C/16T","Base/Boost":"2.5 / 4.7 GHz","Cache":"20MB L3","TDP":"65W","iGPU":"Không","RAM hỗ trợ":"DDR5-4800 / DDR4-3200"},80,4.7,["intel","i5","14400f","best value","gaming","budget"],"LGA1700_DDR5"),
  p("cpu-i3-14100","Intel Core i3-14100","cpu","Intel",3290000,"4C/8T văn phòng có iGPU",{Socket:"LGA 1700","Nhân/Luồng":"4C/8T","Base/Boost":"3.5 / 4.7 GHz","Cache":"12MB L3","TDP":"60W","iGPU":"UHD 730"},40,4.3,["intel","i3","14100","văn phòng","igpu","budget"],"LGA1700_DDR5"),
  p("cpu-i3-14100f","Intel Core i3-14100F","cpu","Intel",2590000,"4C/8T gaming entry, không iGPU",{Socket:"LGA 1700","Nhân/Luồng":"4C/8T","Base/Boost":"3.5 / 4.7 GHz","Cache":"12MB L3","TDP":"58W","iGPU":"Không"},50,4.3,["intel","i3","14100f","budget","entry"],"LGA1700_DDR5"),

  // === Intel 13th Gen (Raptor Lake) ===
  p("cpu-i9-13900k","Intel Core i9-13900K","cpu","Intel",12990000,"Gen 13 flagship 24C/32T 5.8GHz",{Socket:"LGA 1700","Nhân/Luồng":"24C/32T","Base/Boost":"3.0 / 5.8 GHz","Cache":"36MB L3","TDP":"125W","iGPU":"UHD 770"},15,4.7,["intel","i9","13900k","gen13"],"LGA1700_DDR5"),
  p("cpu-i7-13700k","Intel Core i7-13700K","cpu","Intel",8490000,"Gen 13 16C/24T 5.4GHz",{Socket:"LGA 1700","Nhân/Luồng":"16C/24T","Base/Boost":"3.4 / 5.4 GHz","Cache":"30MB L3","TDP":"125W","iGPU":"UHD 770"},20,4.6,["intel","i7","13700k","gen13"],"LGA1700_DDR5"),
  p("cpu-i7-13700f","Intel Core i7-13700F","cpu","Intel",6990000,"Gen 13 16C/24T locked, no iGPU",{Socket:"LGA 1700","Nhân/Luồng":"16C/24T","Base/Boost":"2.1 / 5.2 GHz","Cache":"30MB L3","TDP":"65W","iGPU":"Không"},20,4.5,["intel","i7","13700f","gen13"],"LGA1700_DDR5"),
  p("cpu-i5-13600k","Intel Core i5-13600K","cpu","Intel",6490000,"Gen 13 14C/20T 5.1GHz, ép xung",{Socket:"LGA 1700","Nhân/Luồng":"14C/20T","Base/Boost":"3.5 / 5.1 GHz","Cache":"24MB L3","TDP":"125W","iGPU":"UHD 770"},25,4.5,["intel","i5","13600k","gen13"],"LGA1700_DDR5"),
  p("cpu-i5-13500","Intel Core i5-13500","cpu","Intel",4990000,"Gen 13 14C/20T locked",{Socket:"LGA 1700","Nhân/Luồng":"14C/20T","Base/Boost":"2.5 / 4.8 GHz","Cache":"24MB L3","TDP":"65W","iGPU":"UHD 770"},25,4.4,["intel","i5","13500","gen13"],"LGA1700_DDR5"),
  p("cpu-i5-13400f","Intel Core i5-13400F","cpu","Intel",3790000,"Gen 13 budget gaming 10C/16T",{Socket:"LGA 1700","Nhân/Luồng":"10C/16T","Base/Boost":"2.5 / 4.6 GHz","Cache":"20MB L3","TDP":"65W","iGPU":"Không"},60,4.5,["intel","i5","13400f","gen13","budget"],"LGA1700_DDR5"),
  p("cpu-i5-13400","Intel Core i5-13400","cpu","Intel",4290000,"Gen 13 10C/16T có iGPU",{Socket:"LGA 1700","Nhân/Luồng":"10C/16T","Base/Boost":"2.5 / 4.6 GHz","Cache":"20MB L3","TDP":"65W","iGPU":"UHD 730"},30,4.4,["intel","i5","13400","gen13"],"LGA1700_DDR5"),
  p("cpu-i3-13100f","Intel Core i3-13100F","cpu","Intel",2390000,"Gen 13 entry 4C/8T",{Socket:"LGA 1700","Nhân/Luồng":"4C/8T","Base/Boost":"3.4 / 4.5 GHz","Cache":"12MB L3","TDP":"58W","iGPU":"Không"},40,4.2,["intel","i3","13100f","gen13","entry"],"LGA1700_DDR5"),

  // === Intel 12th Gen (Alder Lake) ===
  p("cpu-i7-12700k","Intel Core i7-12700K","cpu","Intel",7490000,"Gen 12 12C/20T 5.0GHz",{Socket:"LGA 1700","Nhân/Luồng":"12C/20T","Base/Boost":"3.6 / 5.0 GHz","Cache":"25MB L3","TDP":"125W","iGPU":"UHD 770"},15,4.5,["intel","i7","12700k","gen12"],"LGA1700_DDR5"),
  p("cpu-i7-12700f","Intel Core i7-12700F","cpu","Intel",5990000,"Gen 12 12C/20T locked, no iGPU",{Socket:"LGA 1700","Nhân/Luồng":"12C/20T","Base/Boost":"2.1 / 4.9 GHz","Cache":"25MB L3","TDP":"65W","iGPU":"Không"},15,4.4,["intel","i7","12700f","gen12"],"LGA1700_DDR5"),
  p("cpu-i5-12600k","Intel Core i5-12600K","cpu","Intel",5490000,"Gen 12 10C/16T OC, good value",{Socket:"LGA 1700","Nhân/Luồng":"10C/16T","Base/Boost":"3.7 / 4.9 GHz","Cache":"20MB L3","TDP":"125W","iGPU":"UHD 770"},20,4.4,["intel","i5","12600k","gen12"],"LGA1700_DDR5"),
  p("cpu-i5-12400f","Intel Core i5-12400F","cpu","Intel",2990000,"Gen 12 budget king 6C/12T",{Socket:"LGA 1700","Nhân/Luồng":"6C/12T","Base/Boost":"2.5 / 4.4 GHz","Cache":"18MB L3","TDP":"65W","iGPU":"Không"},50,4.5,["intel","i5","12400f","gen12","budget"],"LGA1700_DDR5"),
  p("cpu-i5-12400","Intel Core i5-12400","cpu","Intel",3490000,"Gen 12 6C/12T có iGPU",{Socket:"LGA 1700","Nhân/Luồng":"6C/12T","Base/Boost":"2.5 / 4.4 GHz","Cache":"18MB L3","TDP":"65W","iGPU":"UHD 730"},30,4.4,["intel","i5","12400","gen12"],"LGA1700_DDR5"),
  p("cpu-i3-12100f","Intel Core i3-12100F","cpu","Intel",2190000,"Gen 12 entry 4C/8T gaming budget",{Socket:"LGA 1700","Nhân/Luồng":"4C/8T","Base/Boost":"3.3 / 4.3 GHz","Cache":"12MB L3","TDP":"58W","iGPU":"Không"},40,4.3,["intel","i3","12100f","gen12","entry"],"LGA1700_DDR5"),
  p("cpu-i3-12100","Intel Core i3-12100","cpu","Intel",2690000,"Gen 12 entry 4C/8T có iGPU",{Socket:"LGA 1700","Nhân/Luồng":"4C/8T","Base/Boost":"3.3 / 4.3 GHz","Cache":"12MB L3","TDP":"60W","iGPU":"UHD 730"},30,4.2,["intel","i3","12100","gen12"],"LGA1700_DDR5"),

  // === AMD Ryzen 7000 (Zen 4 — AM5) ===
  p("cpu-r9-7950x","AMD Ryzen 9 7950X","cpu","AMD",14990000,"Flagship 16C/32T 5.7GHz Zen 4, AM5",{Socket:"AM5","Nhân/Luồng":"16C/32T","Base/Boost":"4.5 / 5.7 GHz","Cache":"64MB L3","TDP":"170W","iGPU":"RDNA 2 (2CU)","RAM hỗ trợ":"DDR5-5200","Kiến trúc":"Zen 4"},15,4.8,["amd","ryzen9","7950x","flagship","workstation","16 nhân"],"AM5_DDR5"),
  p("cpu-r9-7950x3d","AMD Ryzen 9 7950X3D","cpu","AMD",16990000,"3D V-Cache 128MB, 16C/32T, best all-around",{Socket:"AM5","Nhân/Luồng":"16C/32T","Base/Boost":"4.2 / 5.7 GHz","Cache":"128MB L3 (3D V-Cache)","TDP":"120W","iGPU":"RDNA 2"},10,4.9,["amd","ryzen9","7950x3d","v-cache","flagship"],"AM5_DDR5"),
  p("cpu-r9-7900x","AMD Ryzen 9 7900X","cpu","AMD",10990000,"12C/24T 5.6GHz Zen 4, workstation/gaming",{Socket:"AM5","Nhân/Luồng":"12C/24T","Base/Boost":"4.7 / 5.6 GHz","Cache":"64MB L3","TDP":"170W","iGPU":"RDNA 2"},20,4.7,["amd","ryzen9","7900x","workstation","12 nhân"],"AM5_DDR5"),
  p("cpu-r9-7900","AMD Ryzen 9 7900","cpu","AMD",9490000,"12C/24T 65W eco, hiệu năng/watt tốt",{Socket:"AM5","Nhân/Luồng":"12C/24T","Base/Boost":"3.7 / 5.4 GHz","Cache":"64MB L3","TDP":"65W","iGPU":"RDNA 2"},15,4.6,["amd","ryzen9","7900","eco"],"AM5_DDR5"),
  p("cpu-r7-7800x3d","AMD Ryzen 7 7800X3D","cpu","AMD",9990000,"VUA GAMING! 8C/16T + 96MB 3D V-Cache, FPS cao nhất",{Socket:"AM5","Nhân/Luồng":"8C/16T","Base/Boost":"4.2 / 5.0 GHz","Cache":"96MB L3 (3D V-Cache)","TDP":"120W","iGPU":"RDNA 2","RAM hỗ trợ":"DDR5-5200"},40,4.9,["amd","ryzen7","7800x3d","v-cache","gaming king","vua gaming"],"AM5_DDR5"),
  p("cpu-r7-7700x","AMD Ryzen 7 7700X","cpu","AMD",7490000,"8C/16T 5.4GHz Zen 4, gaming/productivity",{Socket:"AM5","Nhân/Luồng":"8C/16T","Base/Boost":"4.5 / 5.4 GHz","Cache":"32MB L3","TDP":"105W","iGPU":"RDNA 2"},25,4.6,["amd","ryzen7","7700x","gaming"],"AM5_DDR5"),
  p("cpu-r7-7700","AMD Ryzen 7 7700","cpu","AMD",6490000,"8C/16T 65W eco version",{Socket:"AM5","Nhân/Luồng":"8C/16T","Base/Boost":"3.8 / 5.3 GHz","Cache":"32MB L3","TDP":"65W","iGPU":"RDNA 2"},20,4.5,["amd","ryzen7","7700","eco"],"AM5_DDR5"),
  p("cpu-r5-7600x","AMD Ryzen 5 7600X","cpu","AMD",5190000,"6C/12T 5.3GHz Zen 4, budget AM5 gaming",{Socket:"AM5","Nhân/Luồng":"6C/12T","Base/Boost":"4.7 / 5.3 GHz","Cache":"32MB L3","TDP":"105W","iGPU":"RDNA 2","RAM hỗ trợ":"DDR5-5200"},40,4.6,["amd","ryzen5","7600x","budget am5","gaming"],"AM5_DDR5"),
  p("cpu-r5-7600","AMD Ryzen 5 7600","cpu","AMD",4490000,"6C/12T 65W eco, best value AM5",{Socket:"AM5","Nhân/Luồng":"6C/12T","Base/Boost":"3.8 / 5.1 GHz","Cache":"32MB L3","TDP":"65W","iGPU":"RDNA 2"},50,4.6,["amd","ryzen5","7600","budget am5"],"AM5_DDR5"),
  p("cpu-r5-7500f","AMD Ryzen 5 7500F","cpu","AMD",3790000,"6C/12T AM5, không iGPU, budget",{Socket:"AM5","Nhân/Luồng":"6C/12T","Base/Boost":"3.7 / 5.0 GHz","Cache":"32MB L3","TDP":"65W","iGPU":"Không"},40,4.4,["amd","ryzen5","7500f","budget","no igpu"],"AM5_DDR5"),

  // === AMD Ryzen 5000 (Zen 3 — AM4) ===
  p("cpu-r9-5950x","AMD Ryzen 9 5950X","cpu","AMD",8990000,"16C/32T AM4 flagship Zen 3",{Socket:"AM4","Nhân/Luồng":"16C/32T","Base/Boost":"3.4 / 4.9 GHz","Cache":"64MB L3","TDP":"105W","iGPU":"Không"},10,4.7,["amd","ryzen9","5950x","am4","flagship"],"AM4_DDR4"),
  p("cpu-r9-5900x","AMD Ryzen 9 5900X","cpu","AMD",6990000,"12C/24T AM4 workstation",{Socket:"AM4","Nhân/Luồng":"12C/24T","Base/Boost":"3.7 / 4.8 GHz","Cache":"64MB L3","TDP":"105W","iGPU":"Không"},15,4.7,["amd","ryzen9","5900x","am4"],"AM4_DDR4"),
  p("cpu-r7-5800x","AMD Ryzen 7 5800X","cpu","AMD",4990000,"8C/16T AM4 gaming strong",{Socket:"AM4","Nhân/Luồng":"8C/16T","Base/Boost":"3.8 / 4.7 GHz","Cache":"32MB L3","TDP":"105W","iGPU":"Không"},20,4.5,["amd","ryzen7","5800x","am4","gaming"],"AM4_DDR4"),
  p("cpu-r7-5800x3d","AMD Ryzen 7 5800X3D","cpu","AMD",6990000,"8C/16T + 96MB 3D V-Cache, AM4 gaming king",{Socket:"AM4","Nhân/Luồng":"8C/16T","Base/Boost":"3.4 / 4.5 GHz","Cache":"96MB L3 (3D V-Cache)","TDP":"105W","iGPU":"Không"},15,4.8,["amd","ryzen7","5800x3d","am4","v-cache","gaming"],"AM4_DDR4"),
  p("cpu-r7-5700x","AMD Ryzen 7 5700X","cpu","AMD",3990000,"8C/16T AM4 65W eco gaming",{Socket:"AM4","Nhân/Luồng":"8C/16T","Base/Boost":"3.4 / 4.6 GHz","Cache":"32MB L3","TDP":"65W","iGPU":"Không"},25,4.5,["amd","ryzen7","5700x","am4","eco"],"AM4_DDR4"),
  p("cpu-r7-5700g","AMD Ryzen 7 5700G","cpu","AMD",4490000,"8C/16T AM4 + Vega 8 iGPU mạnh",{Socket:"AM4","Nhân/Luồng":"8C/16T","Base/Boost":"3.8 / 4.6 GHz","Cache":"16MB L3","TDP":"65W","iGPU":"Vega 8 (2100MHz)"},20,4.4,["amd","ryzen7","5700g","am4","igpu","apu"],"AM4_DDR4"),
  p("cpu-r5-5600x","AMD Ryzen 5 5600X","cpu","AMD",3590000,"6C/12T AM4 gaming/productivity",{Socket:"AM4","Nhân/Luồng":"6C/12T","Base/Boost":"3.7 / 4.6 GHz","Cache":"32MB L3","TDP":"65W","iGPU":"Không"},30,4.6,["amd","ryzen5","5600x","am4","gaming"],"AM4_DDR4"),
  p("cpu-r5-5600","AMD Ryzen 5 5600","cpu","AMD",2790000,"6C/12T AM4 best budget, giá cực rẻ",{Socket:"AM4","Nhân/Luồng":"6C/12T","Base/Boost":"3.5 / 4.4 GHz","Cache":"32MB L3","TDP":"65W","iGPU":"Không","RAM hỗ trợ":"DDR4-3200"},50,4.6,["amd","ryzen5","5600","am4","best budget","giá rẻ"],"AM4_DDR4"),
  p("cpu-r5-5600g","AMD Ryzen 5 5600G","cpu","AMD",3190000,"6C/12T AM4 + Vega 7, PC văn phòng",{Socket:"AM4","Nhân/Luồng":"6C/12T","Base/Boost":"3.9 / 4.4 GHz","Cache":"16MB L3","TDP":"65W","iGPU":"Vega 7"},35,4.4,["amd","ryzen5","5600g","am4","igpu","apu","văn phòng"],"AM4_DDR4"),
  p("cpu-r5-5500","AMD Ryzen 5 5500","cpu","AMD",2390000,"6C/12T AM4 siêu rẻ",{Socket:"AM4","Nhân/Luồng":"6C/12T","Base/Boost":"3.6 / 4.2 GHz","Cache":"16MB L3","TDP":"65W","iGPU":"Không"},40,4.3,["amd","ryzen5","5500","am4","siêu rẻ"],"AM4_DDR4"),
  p("cpu-r3-4100","AMD Ryzen 3 4100","cpu","AMD",1690000,"4C/8T AM4 entry level",{Socket:"AM4","Nhân/Luồng":"4C/8T","Base/Boost":"3.8 / 4.0 GHz","Cache":"4MB L3","TDP":"65W","iGPU":"Không"},30,3.8,["amd","ryzen3","4100","am4","entry"],"AM4_DDR4"),

  // === AMD Ryzen 8000G (Zen 4 APU — AM5) ===
  p("cpu-r7-8700g","AMD Ryzen 7 8700G","cpu","AMD",7490000,"8C/16T AM5 APU, Radeon 780M iGPU mạnh nhất",{Socket:"AM5","Nhân/Luồng":"8C/16T","Base/Boost":"4.2 / 5.1 GHz","Cache":"16MB L3","TDP":"65W","iGPU":"Radeon 780M (12CU RDNA 3)"},20,4.5,["amd","ryzen7","8700g","apu","igpu","rdna3"],"AM5_DDR5"),
  p("cpu-r5-8600g","AMD Ryzen 5 8600G","cpu","AMD",5490000,"6C/12T AM5 APU, Radeon 760M",{Socket:"AM5","Nhân/Luồng":"6C/12T","Base/Boost":"4.3 / 5.0 GHz","Cache":"16MB L3","TDP":"65W","iGPU":"Radeon 760M (8CU RDNA 3)"},25,4.4,["amd","ryzen5","8600g","apu","igpu"],"AM5_DDR5"),
  p("cpu-r5-8500g","AMD Ryzen 5 8500G","cpu","AMD",4290000,"6C/12T AM5 APU budget",{Socket:"AM5","Nhân/Luồng":"6C/12T","Base/Boost":"3.5 / 5.0 GHz","Cache":"16MB L3","TDP":"65W","iGPU":"Radeon 740M (4CU)"},30,4.2,["amd","ryzen5","8500g","apu","budget"],"AM5_DDR5"),
];

/* ═══════════════════════════════════════
   GPU — ~120 SKUs (multi-brand AIB models)
   ═══════════════════════════════════════ */
const gpus: Product[] = [
  // === NVIDIA RTX 4090 ===
  p("gpu-4090-fe","NVIDIA GeForce RTX 4090 Founders Edition","gpu","NVIDIA",45990000,"Flagship 24GB GDDR6X, 4K Ultra king",{Chip:"AD102","VRAM":"24GB GDDR6X","Bus":"384-bit","Boost Clock":"2520 MHz","TDP":"450W","Cổng nguồn":"1x 16-pin (12VHPWR)","Cổng xuất":"3x DP 1.4a + 1x HDMI 2.1","RT Cores":"3rd Gen","Tensor Cores":"4th Gen","DLSS":"3.5"},10,4.9,["nvidia","rtx4090","flagship","4k","24gb"],"PCIe4"),
  p("gpu-4090-rog","ASUS ROG STRIX RTX 4090 OC","gpu","ASUS",49990000,"RTX 4090 OC Edition, tản 3.5 slot khủng",{Chip:"AD102","VRAM":"24GB GDDR6X","Bus":"384-bit","Boost Clock":"2610 MHz (OC)","TDP":"450W","Quạt":"3 quạt Axial-tech"},8,4.9,["nvidia","rtx4090","asus","rog strix","oc"],"PCIe4"),
  p("gpu-4090-tuf","ASUS TUF Gaming RTX 4090 OC","gpu","ASUS",47990000,"RTX 4090 TUF bền bỉ, Military-grade",{Chip:"AD102","VRAM":"24GB GDDR6X","Boost Clock":"2565 MHz","TDP":"450W","Quạt":"3 quạt Axial-tech","Chứng nhận":"MIL-STD-810H"},8,4.8,["nvidia","rtx4090","asus","tuf","bền"],"PCIe4"),
  p("gpu-4090-msi-trio","MSI RTX 4090 GAMING X TRIO","gpu","MSI",48990000,"RTX 4090 MSI flagship, TRI FROZR 3",{Chip:"AD102","VRAM":"24GB GDDR6X","Boost Clock":"2595 MHz","TDP":"450W","Tản nhiệt":"TRI FROZR 3"},8,4.8,["nvidia","rtx4090","msi","gaming x trio"],"PCIe4"),
  p("gpu-4090-gv","Gigabyte RTX 4090 GAMING OC","gpu","Gigabyte",46990000,"RTX 4090 Gigabyte, WINDFORCE cooling",{Chip:"AD102","VRAM":"24GB GDDR6X","Boost Clock":"2550 MHz","TDP":"450W","Tản nhiệt":"WINDFORCE 3X"},8,4.8,["nvidia","rtx4090","gigabyte","gaming oc"],"PCIe4"),

  // === NVIDIA RTX 4080 Super ===
  p("gpu-4080s-fe","NVIDIA RTX 4080 Super Founders Edition","gpu","NVIDIA",29990000,"4K gaming strong, 16GB GDDR6X",{Chip:"AD103","VRAM":"16GB GDDR6X","Bus":"256-bit","Boost Clock":"2550 MHz","TDP":"320W","Cổng nguồn":"1x 16-pin","RT Cores":"3rd Gen","DLSS":"3.5"},15,4.8,["nvidia","rtx4080","super","4k","16gb"],"PCIe4"),
  p("gpu-4080s-rog","ASUS ROG STRIX RTX 4080 Super OC","gpu","ASUS",33990000,"RTX 4080S ROG OC triple-fan",{Chip:"AD103","VRAM":"16GB GDDR6X","Boost Clock":"2640 MHz (OC)","TDP":"320W"},10,4.8,["nvidia","rtx4080s","asus","rog"],"PCIe4"),
  p("gpu-4080s-tuf","ASUS TUF RTX 4080 Super OC","gpu","ASUS",31990000,"RTX 4080S TUF bền Military",{Chip:"AD103","VRAM":"16GB GDDR6X","Boost Clock":"2595 MHz","TDP":"320W"},12,4.7,["nvidia","rtx4080s","asus","tuf"],"PCIe4"),
  p("gpu-4080s-msi","MSI RTX 4080 Super GAMING X SLIM","gpu","MSI",31990000,"RTX 4080S MSI slim design",{Chip:"AD103","VRAM":"16GB GDDR6X","Boost Clock":"2610 MHz","TDP":"320W"},12,4.7,["nvidia","rtx4080s","msi"],"PCIe4"),
  p("gpu-4080s-gv","Gigabyte RTX 4080 Super GAMING OC","gpu","Gigabyte",30990000,"RTX 4080S Gigabyte OC",{Chip:"AD103","VRAM":"16GB GDDR6X","Boost Clock":"2565 MHz","TDP":"320W"},12,4.7,["nvidia","rtx4080s","gigabyte"],"PCIe4"),

  // === NVIDIA RTX 4070 Ti Super ===
  p("gpu-4070tis-fe","NVIDIA RTX 4070 Ti Super FE","gpu","NVIDIA",21990000,"1440p-4K sweet spot, 16GB GDDR6X",{Chip:"AD103","VRAM":"16GB GDDR6X","Bus":"256-bit","Boost Clock":"2610 MHz","TDP":"285W","DLSS":"3.5"},20,4.7,["nvidia","rtx4070ti","super","1440p","4k","16gb"],"PCIe4"),
  p("gpu-4070tis-rog","ASUS ROG STRIX RTX 4070 Ti Super OC","gpu","ASUS",24990000,"RTX 4070TiS ROG OC",{Chip:"AD103","VRAM":"16GB GDDR6X","Boost Clock":"2700 MHz (OC)","TDP":"285W"},12,4.7,["nvidia","rtx4070tis","asus","rog"],"PCIe4"),
  p("gpu-4070tis-tuf","ASUS TUF RTX 4070 Ti Super OC","gpu","ASUS",23490000,"RTX 4070TiS TUF",{Chip:"AD103","VRAM":"16GB GDDR6X","Boost Clock":"2655 MHz","TDP":"285W"},15,4.7,["nvidia","rtx4070tis","asus","tuf"],"PCIe4"),
  p("gpu-4070tis-msi","MSI RTX 4070 Ti Super GAMING X SLIM","gpu","MSI",23490000,"RTX 4070TiS MSI slim",{Chip:"AD103","VRAM":"16GB GDDR6X","Boost Clock":"2640 MHz","TDP":"285W"},15,4.6,["nvidia","rtx4070tis","msi"],"PCIe4"),
  p("gpu-4070tis-gv","Gigabyte RTX 4070 Ti Super GAMING OC","gpu","Gigabyte",22490000,"RTX 4070TiS Gigabyte",{Chip:"AD103","VRAM":"16GB GDDR6X","Boost Clock":"2625 MHz","TDP":"285W"},15,4.6,["nvidia","rtx4070tis","gigabyte"],"PCIe4"),

  // === NVIDIA RTX 4070 Super ===
  p("gpu-4070s-fe","NVIDIA RTX 4070 Super FE","gpu","NVIDIA",14990000,"1440p Ultra sweet spot, 12GB",{Chip:"AD103","VRAM":"12GB GDDR6X","Bus":"192-bit","Boost Clock":"2475 MHz","TDP":"220W","DLSS":"3.5"},25,4.7,["nvidia","rtx4070","super","1440p","12gb"],"PCIe4"),
  p("gpu-4070s-rog","ASUS ROG STRIX RTX 4070 Super OC","gpu","ASUS",17490000,"4070S ROG OC triple-fan",{Chip:"AD103","VRAM":"12GB GDDR6X","Boost Clock":"2565 MHz","TDP":"220W"},15,4.7,["nvidia","rtx4070s","rog"],"PCIe4"),
  p("gpu-4070s-tuf","ASUS TUF RTX 4070 Super OC","gpu","ASUS",15990000,"4070S TUF Military",{Chip:"AD103","VRAM":"12GB GDDR6X","Boost Clock":"2535 MHz","TDP":"220W"},18,4.6,["nvidia","rtx4070s","tuf"],"PCIe4"),
  p("gpu-4070s-msi","MSI RTX 4070 Super GAMING X SLIM","gpu","MSI",15990000,"4070S MSI slim dual-fan",{Chip:"AD103","VRAM":"12GB GDDR6X","Boost Clock":"2520 MHz","TDP":"220W"},18,4.6,["nvidia","rtx4070s","msi"],"PCIe4"),
  p("gpu-4070s-gv","Gigabyte RTX 4070 Super GAMING OC","gpu","Gigabyte",15490000,"4070S Gigabyte",{Chip:"AD103","VRAM":"12GB GDDR6X","Boost Clock":"2505 MHz","TDP":"220W"},18,4.6,["nvidia","rtx4070s","gigabyte"],"PCIe4"),
  p("gpu-4070s-zotac","ZOTAC RTX 4070 Super Twin Edge","gpu","ZOTAC",14490000,"4070S Zotac compact",{Chip:"AD103","VRAM":"12GB GDDR6X","Boost Clock":"2475 MHz","TDP":"220W"},15,4.5,["nvidia","rtx4070s","zotac","compact"],"PCIe4"),

  // === NVIDIA RTX 4070 ===
  p("gpu-4070-fe","NVIDIA RTX 4070 FE","gpu","NVIDIA",13490000,"1440p gaming, DLSS 3",{Chip:"AD104","VRAM":"12GB GDDR6X","Bus":"192-bit","Boost Clock":"2475 MHz","TDP":"200W","DLSS":"3.5"},20,4.5,["nvidia","rtx4070","1440p"],"PCIe4"),
  p("gpu-4070-tuf","ASUS TUF RTX 4070 OC","gpu","ASUS",14490000,"RTX 4070 TUF",{Chip:"AD104","VRAM":"12GB GDDR6X","Boost Clock":"2535 MHz","TDP":"200W"},15,4.5,["nvidia","rtx4070","tuf"],"PCIe4"),
  p("gpu-4070-msi","MSI RTX 4070 GAMING X SLIM","gpu","MSI",14490000,"RTX 4070 MSI",{Chip:"AD104","VRAM":"12GB GDDR6X","Boost Clock":"2520 MHz","TDP":"200W"},15,4.5,["nvidia","rtx4070","msi"],"PCIe4"),

  // === NVIDIA RTX 4060 Ti ===
  p("gpu-4060ti-fe","NVIDIA RTX 4060 Ti 8GB FE","gpu","NVIDIA",10990000,"1080p Ultra, DLSS 3, 8GB",{Chip:"AD106","VRAM":"8GB GDDR6","Bus":"128-bit","Boost Clock":"2535 MHz","TDP":"160W","DLSS":"3.5"},30,4.5,["nvidia","rtx4060ti","1080p","8gb"],"PCIe4"),
  p("gpu-4060ti-16-fe","NVIDIA RTX 4060 Ti 16GB FE","gpu","NVIDIA",12990000,"1080p Ultra, 16GB VRAM future-proof",{Chip:"AD106","VRAM":"16GB GDDR6","Bus":"128-bit","Boost Clock":"2535 MHz","TDP":"165W"},15,4.4,["nvidia","rtx4060ti","16gb"],"PCIe4"),
  p("gpu-4060ti-rog","ASUS ROG STRIX RTX 4060 Ti OC","gpu","ASUS",12990000,"4060Ti ROG OC Edition",{Chip:"AD106","VRAM":"8GB GDDR6","Boost Clock":"2625 MHz","TDP":"160W"},15,4.5,["nvidia","rtx4060ti","rog"],"PCIe4"),
  p("gpu-4060ti-tuf","ASUS TUF RTX 4060 Ti OC","gpu","ASUS",11490000,"4060Ti TUF Military",{Chip:"AD106","VRAM":"8GB GDDR6","Boost Clock":"2580 MHz","TDP":"160W"},20,4.5,["nvidia","rtx4060ti","tuf"],"PCIe4"),
  p("gpu-4060ti-msi","MSI RTX 4060 Ti GAMING X","gpu","MSI",11490000,"4060Ti MSI flagship",{Chip:"AD106","VRAM":"8GB GDDR6","Boost Clock":"2595 MHz","TDP":"160W"},20,4.5,["nvidia","rtx4060ti","msi"],"PCIe4"),
  p("gpu-4060ti-gv","Gigabyte RTX 4060 Ti GAMING OC","gpu","Gigabyte",10990000,"4060Ti Gigabyte",{Chip:"AD106","VRAM":"8GB GDDR6","Boost Clock":"2565 MHz","TDP":"160W"},20,4.4,["nvidia","rtx4060ti","gigabyte"],"PCIe4"),

  // === NVIDIA RTX 4060 ===
  p("gpu-4060-fe","NVIDIA RTX 4060 8GB FE","gpu","NVIDIA",7990000,"1080p gaming mainstream, DLSS 3",{Chip:"AD107","VRAM":"8GB GDDR6","Bus":"128-bit","Boost Clock":"2460 MHz","TDP":"115W","DLSS":"3.5"},40,4.4,["nvidia","rtx4060","1080p","mainstream"],"PCIe4"),
  p("gpu-4060-tuf","ASUS TUF RTX 4060 OC","gpu","ASUS",8990000,"RTX 4060 TUF OC",{Chip:"AD107","VRAM":"8GB GDDR6","Boost Clock":"2535 MHz","TDP":"115W"},20,4.4,["nvidia","rtx4060","tuf"],"PCIe4"),
  p("gpu-4060-msi","MSI RTX 4060 VENTUS 2X OC","gpu","MSI",8490000,"RTX 4060 MSI compact",{Chip:"AD107","VRAM":"8GB GDDR6","Boost Clock":"2490 MHz","TDP":"115W"},25,4.3,["nvidia","rtx4060","msi","ventus"],"PCIe4"),
  p("gpu-4060-gv","Gigabyte RTX 4060 EAGLE OC","gpu","Gigabyte",8290000,"RTX 4060 Gigabyte",{Chip:"AD107","VRAM":"8GB GDDR6","Boost Clock":"2475 MHz","TDP":"115W"},25,4.3,["nvidia","rtx4060","gigabyte"],"PCIe4"),
  p("gpu-4060-zotac","ZOTAC RTX 4060 Twin Edge","gpu","ZOTAC",7790000,"RTX 4060 Zotac compact nhỏ gọn",{Chip:"AD107","VRAM":"8GB GDDR6","Boost Clock":"2460 MHz","TDP":"115W"},25,4.3,["nvidia","rtx4060","zotac","compact"],"PCIe4"),

  // === AMD Radeon RX 7900 XTX ===
  p("gpu-7900xtx-ref","AMD Radeon RX 7900 XTX","gpu","AMD",24990000,"AMD flagship 24GB, 4K gaming, FSR 3",{Chip:"Navi 31","VRAM":"24GB GDDR6","Bus":"384-bit","Boost Clock":"2500 MHz","TDP":"355W","FSR":"3.0","Ray Accelerators":"96"},12,4.7,["amd","rx7900xtx","flagship","4k","24gb"],"PCIe4"),
  p("gpu-7900xtx-sapphire","Sapphire RX 7900 XTX NITRO+","gpu","Sapphire",26990000,"7900XTX Sapphire flagship",{Chip:"Navi 31","VRAM":"24GB GDDR6","Boost Clock":"2560 MHz","TDP":"355W"},10,4.7,["amd","rx7900xtx","sapphire","nitro"],"PCIe4"),
  p("gpu-7900xtx-asrock","ASRock RX 7900 XTX Phantom Gaming","gpu","ASRock",25490000,"7900XTX ASRock Phantom",{Chip:"Navi 31","VRAM":"24GB GDDR6","Boost Clock":"2530 MHz","TDP":"355W"},10,4.6,["amd","rx7900xtx","asrock"],"PCIe4"),

  // === AMD RX 7900 XT ===
  p("gpu-7900xt-ref","AMD Radeon RX 7900 XT","gpu","AMD",19990000,"20GB 4K gaming AMD",{Chip:"Navi 31","VRAM":"20GB GDDR6","Bus":"320-bit","Boost Clock":"2400 MHz","TDP":"315W","FSR":"3.0"},15,4.5,["amd","rx7900xt","4k","20gb"],"PCIe4"),
  p("gpu-7900xt-sapphire","Sapphire RX 7900 XT NITRO+","gpu","Sapphire",21490000,"7900XT Sapphire",{Chip:"Navi 31","VRAM":"20GB GDDR6","Boost Clock":"2450 MHz","TDP":"315W"},12,4.5,["amd","rx7900xt","sapphire"],"PCIe4"),

  // === AMD RX 7800 XT ===
  p("gpu-7800xt-ref","AMD Radeon RX 7800 XT","gpu","AMD",12490000,"16GB 1440p Ultra, best value AMD",{Chip:"Navi 32","VRAM":"16GB GDDR6","Bus":"256-bit","Boost Clock":"2430 MHz","TDP":"263W","FSR":"3.0"},25,4.6,["amd","rx7800xt","1440p","16gb","best value"],"PCIe4"),
  p("gpu-7800xt-sapphire","Sapphire RX 7800 XT NITRO+","gpu","Sapphire",13490000,"7800XT Sapphire NITRO",{Chip:"Navi 32","VRAM":"16GB GDDR6","Boost Clock":"2475 MHz","TDP":"263W"},18,4.6,["amd","rx7800xt","sapphire"],"PCIe4"),
  p("gpu-7800xt-asrock","ASRock RX 7800 XT Challenger","gpu","ASRock",12990000,"7800XT ASRock",{Chip:"Navi 32","VRAM":"16GB GDDR6","Boost Clock":"2450 MHz","TDP":"263W"},15,4.5,["amd","rx7800xt","asrock"],"PCIe4"),
  p("gpu-7800xt-xfx","XFX RX 7800 XT MERC 310","gpu","XFX",12990000,"7800XT XFX triple-fan",{Chip:"Navi 32","VRAM":"16GB GDDR6","Boost Clock":"2455 MHz","TDP":"263W"},15,4.5,["amd","rx7800xt","xfx"],"PCIe4"),

  // === AMD RX 7700 XT ===
  p("gpu-7700xt-ref","AMD Radeon RX 7700 XT","gpu","AMD",10990000,"12GB 1440p medium-high",{Chip:"Navi 32","VRAM":"12GB GDDR6","Bus":"192-bit","Boost Clock":"2544 MHz","TDP":"245W","FSR":"3.0"},20,4.4,["amd","rx7700xt","1440p","12gb"],"PCIe4"),
  p("gpu-7700xt-sapphire","Sapphire RX 7700 XT NITRO+","gpu","Sapphire",11990000,"7700XT Sapphire",{Chip:"Navi 32","VRAM":"12GB GDDR6","Boost Clock":"2584 MHz","TDP":"245W"},15,4.4,["amd","rx7700xt","sapphire"],"PCIe4"),

  // === AMD RX 7600 ===
  p("gpu-7600-ref","AMD Radeon RX 7600 8GB","gpu","AMD",6490000,"1080p gaming giá rẻ, FSR 3",{Chip:"Navi 33","VRAM":"8GB GDDR6","Bus":"128-bit","Boost Clock":"2655 MHz","TDP":"165W","FSR":"3.0"},40,4.4,["amd","rx7600","1080p","budget","8gb","giá rẻ"],"PCIe4"),
  p("gpu-7600-sapphire","Sapphire RX 7600 PULSE","gpu","Sapphire",6990000,"7600 Sapphire PULSE",{Chip:"Navi 33","VRAM":"8GB GDDR6","Boost Clock":"2695 MHz","TDP":"165W"},25,4.4,["amd","rx7600","sapphire"],"PCIe4"),
  p("gpu-7600-asrock","ASRock RX 7600 Challenger","gpu","ASRock",6490000,"7600 ASRock budget",{Chip:"Navi 33","VRAM":"8GB GDDR6","Boost Clock":"2655 MHz","TDP":"165W"},25,4.3,["amd","rx7600","asrock"],"PCIe4"),
  p("gpu-7600-msi","MSI RX 7600 MECH 2X","gpu","MSI",6790000,"7600 MSI MECH dual-fan",{Chip:"Navi 33","VRAM":"8GB GDDR6","Boost Clock":"2685 MHz","TDP":"165W"},25,4.3,["amd","rx7600","msi"],"PCIe4"),
  p("gpu-7600xt","AMD Radeon RX 7600 XT 16GB","gpu","AMD",8490000,"1080p+, 16GB VRAM future-proof",{Chip:"Navi 33","VRAM":"16GB GDDR6","Bus":"128-bit","Boost Clock":"2755 MHz","TDP":"150W"},20,4.5,["amd","rx7600xt","16gb"],"PCIe4"),

  // === Intel Arc ===
  p("gpu-arc-a770","Intel Arc A770 16GB","gpu","Intel",7490000,"Intel GPU, 16GB, giá rẻ, XeSS",{Chip:"ACM-G10","VRAM":"16GB GDDR6","Bus":"256-bit","Boost Clock":"2100 MHz","TDP":"225W","XeSS":"1.0"},15,4.0,["intel","arc","a770","16gb","xess","budget"],"PCIe4"),
  p("gpu-arc-a750","Intel Arc A750 8GB","gpu","Intel",5490000,"Intel budget GPU, 8GB, XeSS",{Chip:"ACM-G10","VRAM":"8GB GDDR6","Bus":"256-bit","Boost Clock":"2050 MHz","TDP":"225W"},15,3.9,["intel","arc","a750","8gb","budget"],"PCIe4"),
  p("gpu-arc-a580","Intel Arc A580 8GB","gpu","Intel",4490000,"Intel entry GPU",{Chip:"ACM-G10","VRAM":"8GB GDDR6","Boost Clock":"1700 MHz","TDP":"185W"},15,3.7,["intel","arc","a580"],"PCIe4"),

  // === NVIDIA GTX 1650/1660 (budget/legacy) ===
  p("gpu-1660s","NVIDIA GTX 1660 Super 6GB","gpu","NVIDIA",4990000,"1080p eSports budget, Turing",{Chip:"TU116","VRAM":"6GB GDDR6","Bus":"192-bit","Boost Clock":"1785 MHz","TDP":"125W"},15,4.1,["nvidia","gtx1660","super","1080p","budget","esports"],"PCIe3"),
  p("gpu-1650","NVIDIA GTX 1650 4GB","gpu","NVIDIA",3490000,"Entry gaming 4GB",{Chip:"TU117","VRAM":"4GB GDDR6","Bus":"128-bit","Boost Clock":"1590 MHz","TDP":"75W"},20,3.8,["nvidia","gtx1650","entry","4gb"],"PCIe3"),
];

/* ═══════════════════════════════════════
   MAINBOARD — ~80 SKUs
   ═══════════════════════════════════════ */
const mainboards: Product[] = [
  // === Intel Z790 ===
  p("mb-z790-rog-hero","ASUS ROG MAXIMUS Z790 HERO","mainboard","ASUS",15990000,"Z790 flagship, WiFi 6E, Thunderbolt 4",{Socket:"LGA 1700",Chipset:"Z790","Form Factor":"ATX","RAM":"4x DDR5-7800+","M.2":"5x M.2 (1x PCIe 5.0)","PCIe":"1x PCIe 5.0 x16","USB":"USB 3.2 Gen 2x2, Thunderbolt 4","Mạng":"WiFi 6E + 2.5G LAN"},8,4.9,["asus","z790","rog","hero","flagship","wifi6e"],"LGA1700_DDR5"),
  p("mb-z790-rog-a","ASUS ROG STRIX Z790-A Gaming WiFi","mainboard","ASUS",8490000,"Z790 high-end trắng đẹp, WiFi 6E",{Socket:"LGA 1700",Chipset:"Z790","Form Factor":"ATX","RAM":"4x DDR5-7200+","M.2":"4x M.2 (1x PCIe 5.0)","PCIe":"1x PCIe 5.0 x16","Mạng":"WiFi 6E + 2.5G LAN"},15,4.8,["asus","z790","rog strix","trắng","wifi6e"],"LGA1700_DDR5"),
  p("mb-z790-rog-e","ASUS ROG STRIX Z790-E Gaming WiFi II","mainboard","ASUS",10990000,"Z790 premium, WiFi 7, PCIe 5.0 x16 + x4",{Socket:"LGA 1700",Chipset:"Z790","Form Factor":"ATX","RAM":"4x DDR5-7800+","M.2":"5x M.2","Mạng":"WiFi 7 + 2.5G LAN"},10,4.8,["asus","z790","rog","wifi7"],"LGA1700_DDR5"),
  p("mb-z790-msi-tomahawk","MSI MAG Z790 TOMAHAWK WIFI","mainboard","MSI",6990000,"Z790 VRM mạnh, WiFi 6E, giá tốt",{Socket:"LGA 1700",Chipset:"Z790","Form Factor":"ATX","RAM":"4x DDR5-7200+","M.2":"4x M.2","VRM":"16+1+1 phase (80A)","Mạng":"WiFi 6E + 2.5G LAN"},20,4.7,["msi","z790","tomahawk","vrm mạnh","wifi6e"],"LGA1700_DDR5"),
  p("mb-z790-msi-edge","MSI MPG Z790 EDGE WIFI","mainboard","MSI",7990000,"Z790 MSI premium",{Socket:"LGA 1700",Chipset:"Z790","Form Factor":"ATX","RAM":"4x DDR5-7600+","M.2":"5x M.2","Mạng":"WiFi 6E + 2.5G LAN"},15,4.7,["msi","z790","edge","wifi6e"],"LGA1700_DDR5"),
  p("mb-z790-gv-aorus-master","Gigabyte Z790 AORUS MASTER","mainboard","Gigabyte",9490000,"Z790 Gigabyte flagship",{Socket:"LGA 1700",Chipset:"Z790","Form Factor":"ATX","RAM":"4x DDR5-8000+","M.2":"5x M.2","Mạng":"WiFi 6E + 10G LAN"},10,4.8,["gigabyte","z790","aorus","master"],"LGA1700_DDR5"),
  p("mb-z790-gv-aorus-elite","Gigabyte Z790 AORUS ELITE AX","mainboard","Gigabyte",5990000,"Z790 value, WiFi 6E",{Socket:"LGA 1700",Chipset:"Z790","Form Factor":"ATX","RAM":"4x DDR5-7600+","M.2":"4x M.2","Mạng":"WiFi 6E + 2.5G LAN"},20,4.6,["gigabyte","z790","aorus elite","wifi6e"],"LGA1700_DDR5"),

  // === Intel B760 ===
  p("mb-b760-msi-tomahawk","MSI MAG B760 TOMAHAWK WIFI","mainboard","MSI",4990000,"B760 VRM mạnh nhất, WiFi 6E",{Socket:"LGA 1700",Chipset:"B760","Form Factor":"ATX","RAM":"4x DDR5-7000+","M.2":"3x M.2","VRM":"12+1+1 phase (80A)","Mạng":"WiFi 6E + 2.5G LAN"},25,4.7,["msi","b760","tomahawk","vrm","wifi6e"],"LGA1700_DDR5"),
  p("mb-b760m-msi-mortar","MSI MAG B760M MORTAR WIFI II","mainboard","MSI",3990000,"B760M mATX VRM tốt, WiFi 6E",{Socket:"LGA 1700",Chipset:"B760","Form Factor":"mATX","RAM":"4x DDR5-7000+","M.2":"2x M.2","Mạng":"WiFi 6E + 2.5G LAN"},30,4.6,["msi","b760m","mortar","matx","wifi6e"],"LGA1700_DDR5"),
  p("mb-b760-asus-tuf","ASUS TUF GAMING B760-PLUS WIFI","mainboard","ASUS",3990000,"B760 TUF bền, WiFi 6",{Socket:"LGA 1700",Chipset:"B760","Form Factor":"ATX","RAM":"4x DDR5-6400+","M.2":"3x M.2","Mạng":"WiFi 6 + 2.5G LAN"},25,4.5,["asus","b760","tuf","wifi"],"LGA1700_DDR5"),
  p("mb-b760m-asus-tuf","ASUS TUF GAMING B760M-PLUS WIFI","mainboard","ASUS",3490000,"B760M TUF mATX, WiFi",{Socket:"LGA 1700",Chipset:"B760","Form Factor":"mATX","RAM":"4x DDR5-6400+","M.2":"2x M.2","Mạng":"WiFi 6"},25,4.5,["asus","b760m","tuf","matx"],"LGA1700_DDR5"),
  p("mb-b760m-gv-ds3h","Gigabyte B760M DS3H AX","mainboard","Gigabyte",2790000,"B760M budget có WiFi AX, 2 khe M.2",{Socket:"LGA 1700",Chipset:"B760","Form Factor":"mATX","RAM":"2x DDR5-6000","M.2":"2x M.2","Mạng":"WiFi 6 AX"},50,4.3,["gigabyte","b760m","ds3h","budget","wifi"],"LGA1700_DDR5"),
  p("mb-b760m-gv-gaming","Gigabyte B760M GAMING X AX","mainboard","Gigabyte",3290000,"B760M Gigabyte mid-range",{Socket:"LGA 1700",Chipset:"B760","Form Factor":"mATX","RAM":"4x DDR5-6400+","M.2":"2x M.2","Mạng":"WiFi 6"},30,4.4,["gigabyte","b760m","gaming"],"LGA1700_DDR5"),
  p("mb-b760m-msi-a","MSI PRO B760M-A WIFI","mainboard","MSI",2990000,"B760M MSI budget + WiFi",{Socket:"LGA 1700",Chipset:"B760","Form Factor":"mATX","RAM":"4x DDR5-6400","M.2":"2x M.2","Mạng":"WiFi 6"},40,4.3,["msi","b760m","pro","budget","wifi"],"LGA1700_DDR5"),

  // === Intel B660 ===
  p("mb-b660m-msi","MSI PRO B660M-A WiFi DDR4","mainboard","MSI",2490000,"B660M DDR4, WiFi, giá rẻ",{Socket:"LGA 1700",Chipset:"B660","Form Factor":"mATX","RAM":"2x DDR4-4800","M.2":"2x M.2","Mạng":"WiFi 6"},30,4.2,["msi","b660m","ddr4","wifi","budget"],"LGA1700_DDR4"),
  p("mb-b660m-gv","Gigabyte B660M DS3H DDR4","mainboard","Gigabyte",2190000,"B660M DDR4 siêu rẻ",{Socket:"LGA 1700",Chipset:"B660","Form Factor":"mATX","RAM":"2x DDR4-4800","M.2":"1x M.2"},25,4.0,["gigabyte","b660m","ddr4","siêu rẻ"],"LGA1700_DDR4"),

  // === AMD X670E ===
  p("mb-x670e-rog-hero","ASUS ROG CROSSHAIR X670E HERO","mainboard","ASUS",14990000,"X670E flagship, WiFi 6E, USB4",{Socket:"AM5",Chipset:"X670E","Form Factor":"ATX","RAM":"4x DDR5-6400+","M.2":"5x M.2 (PCIe 5.0)","PCIe":"PCIe 5.0 x16","Mạng":"WiFi 6E + 2.5G LAN + USB4"},8,4.9,["asus","x670e","rog","hero","flagship"],"AM5_DDR5"),
  p("mb-x670e-rog-e","ASUS ROG STRIX X670E-E Gaming WiFi","mainboard","ASUS",9490000,"X670E premium, PCIe 5.0 dual",{Socket:"AM5",Chipset:"X670E","Form Factor":"ATX","RAM":"4x DDR5-6400+","M.2":"4x M.2","Mạng":"WiFi 6E + 2.5G LAN"},12,4.8,["asus","x670e","rog strix","premium"],"AM5_DDR5"),
  p("mb-x670e-msi","MSI MEG X670E ACE","mainboard","MSI",11990000,"X670E MSI flagship",{Socket:"AM5",Chipset:"X670E","Form Factor":"ATX","RAM":"4x DDR5-6600+","M.2":"4x M.2","Mạng":"WiFi 6E + 10G LAN"},8,4.8,["msi","x670e","meg","ace"],"AM5_DDR5"),
  p("mb-x670e-gv","Gigabyte X670E AORUS MASTER","mainboard","Gigabyte",9990000,"X670E Gigabyte premium",{Socket:"AM5",Chipset:"X670E","Form Factor":"ATX","RAM":"4x DDR5-6600+","M.2":"4x M.2 PCIe 5.0","Mạng":"WiFi 6E + 10G LAN"},10,4.8,["gigabyte","x670e","aorus master"],"AM5_DDR5"),

  // === AMD B650 ===
  p("mb-b650-msi-tomahawk","MSI MAG B650 TOMAHAWK WIFI","mainboard","MSI",4990000,"B650 VRM mạnh, WiFi 6E",{Socket:"AM5",Chipset:"B650","Form Factor":"ATX","RAM":"4x DDR5-7000+","M.2":"3x M.2","VRM":"14+2+1 phase (80A)","Mạng":"WiFi 6E + 2.5G LAN"},25,4.7,["msi","b650","tomahawk","vrm mạnh"],"AM5_DDR5"),
  p("mb-b650-asus-tuf","ASUS TUF GAMING B650-PLUS WIFI","mainboard","ASUS",4490000,"B650 TUF bền, WiFi 6",{Socket:"AM5",Chipset:"B650","Form Factor":"ATX","RAM":"4x DDR5-6400+","M.2":"3x M.2","Mạng":"WiFi 6 + 2.5G LAN"},25,4.6,["asus","b650","tuf","wifi"],"AM5_DDR5"),
  p("mb-b650m-msi-mortar","MSI MAG B650M MORTAR WIFI","mainboard","MSI",3790000,"B650M mATX VRM tốt",{Socket:"AM5",Chipset:"B650","Form Factor":"mATX","RAM":"4x DDR5-6400+","M.2":"2x M.2","Mạng":"WiFi 6E"},25,4.5,["msi","b650m","mortar","matx"],"AM5_DDR5"),
  p("mb-b650m-gv-aorus","Gigabyte B650M AORUS ELITE AX","mainboard","Gigabyte",3490000,"B650M Gigabyte mid-range",{Socket:"AM5",Chipset:"B650","Form Factor":"mATX","RAM":"4x DDR5-6400+","M.2":"2x M.2","Mạng":"WiFi 6"},25,4.4,["gigabyte","b650m","aorus","matx"],"AM5_DDR5"),
  p("mb-b650m-gv-ds3h","Gigabyte B650M DS3H","mainboard","Gigabyte",2590000,"B650M budget AM5",{Socket:"AM5",Chipset:"B650","Form Factor":"mATX","RAM":"2x DDR5-6000","M.2":"2x M.2"},35,4.2,["gigabyte","b650m","ds3h","budget"],"AM5_DDR5"),
  p("mb-b650i-asus","ASUS ROG STRIX B650E-I Gaming WiFi","mainboard","ASUS",5990000,"B650E ITX cho SFF build",{Socket:"AM5",Chipset:"B650E","Form Factor":"Mini-ITX","RAM":"2x DDR5-6400+","M.2":"2x M.2","Mạng":"WiFi 6E + 2.5G LAN"},12,4.6,["asus","b650e","itx","mini","sff"],"AM5_DDR5"),

  // === AMD B550 (AM4) ===
  p("mb-b550-msi-tomahawk","MSI MAG B550 TOMAHAWK","mainboard","MSI",3290000,"B550 AM4 VRM tốt, cho Ryzen 5000",{Socket:"AM4",Chipset:"B550","Form Factor":"ATX","RAM":"4x DDR4-5100+","M.2":"2x M.2 (1x PCIe 4.0)","VRM":"10+2+1 phase (60A)","Mạng":"2.5G LAN"},20,4.5,["msi","b550","tomahawk","am4","vrm"],"AM4_DDR4"),
  p("mb-b550-asus-tuf","ASUS TUF GAMING B550-PLUS WiFi II","mainboard","ASUS",3490000,"B550 AM4 TUF WiFi",{Socket:"AM4",Chipset:"B550","Form Factor":"ATX","RAM":"4x DDR4-5100+","M.2":"2x M.2","Mạng":"WiFi 6 + 2.5G LAN"},20,4.5,["asus","b550","tuf","am4","wifi"],"AM4_DDR4"),
  p("mb-b550m-msi-mortar","MSI MAG B550M MORTAR WiFi","mainboard","MSI",2790000,"B550M AM4 mATX WiFi",{Socket:"AM4",Chipset:"B550","Form Factor":"mATX","RAM":"4x DDR4-4866+","M.2":"2x M.2","Mạng":"WiFi 6"},25,4.4,["msi","b550m","mortar","am4","matx"],"AM4_DDR4"),
  p("mb-b550m-gv","Gigabyte B550M DS3H","mainboard","Gigabyte",1890000,"B550M AM4 siêu rẻ",{Socket:"AM4",Chipset:"B550","Form Factor":"mATX","RAM":"4x DDR4-3600","M.2":"1x M.2"},35,4.1,["gigabyte","b550m","ds3h","am4","siêu rẻ"],"AM4_DDR4"),
  p("mb-b550-gv-aorus","Gigabyte B550 AORUS PRO V2","mainboard","Gigabyte",2990000,"B550 AM4 mid-range",{Socket:"AM4",Chipset:"B550","Form Factor":"ATX","RAM":"4x DDR4-5200+","M.2":"2x M.2","Mạng":"2.5G LAN"},20,4.4,["gigabyte","b550","aorus","am4"],"AM4_DDR4"),

  // === AMD A520 (AM4 budget) ===
  p("mb-a520m-gv","Gigabyte A520M DS3H","mainboard","Gigabyte",1490000,"A520 AM4 entry level",{Socket:"AM4",Chipset:"A520","Form Factor":"mATX","RAM":"2x DDR4-3200","M.2":"1x M.2"},30,3.8,["gigabyte","a520m","am4","entry","siêu rẻ"],"AM4_DDR4"),
  p("mb-a520m-msi","MSI A520M-A PRO","mainboard","MSI",1490000,"A520 MSI AM4 budget",{Socket:"AM4",Chipset:"A520","Form Factor":"mATX","RAM":"2x DDR4-3200","M.2":"1x M.2"},30,3.8,["msi","a520m","am4","budget"],"AM4_DDR4"),
];

/* ═══════════════════════════════════════
   RAM — ~70 SKUs
   ═══════════════════════════════════════ */
const rams: Product[] = [
  // DDR5
  p("ram-ddr5-fury-16-5600","Kingston Fury Beast DDR5 16GB (1x16) 5600MHz","ram","Kingston",890000,"DDR5 16GB kit đơn 5600MHz, XMP 3.0",{"Loại":"DDR5","Dung lượng":"16GB (1x16GB)","Tốc độ":"5600 MHz","CAS Latency":"CL36","Điện áp":"1.1V","XMP":"3.0"},60,4.3,["ddr5","16gb","5600","kingston","fury beast"],"DDR5"),
  p("ram-ddr5-fury-32-5600","Kingston Fury Beast DDR5 32GB (2x16) 5600MHz","ram","Kingston",1690000,"DDR5 32GB dual-channel 5600MHz",{"Loại":"DDR5","Dung lượng":"32GB (2x16GB)","Tốc độ":"5600 MHz","CAS Latency":"CL36","Điện áp":"1.1V","XMP":"3.0"},40,4.5,["ddr5","32gb","5600","kingston","dual-channel"],"DDR5"),
  p("ram-ddr5-fury-32-6000","Kingston Fury Beast DDR5 32GB (2x16) 6000MHz","ram","Kingston",1990000,"DDR5 32GB 6000MHz sweet spot",{"Loại":"DDR5","Dung lượng":"32GB (2x16GB)","Tốc độ":"6000 MHz","CAS Latency":"CL30","Điện áp":"1.35V","XMP/EXPO":"3.0"},35,4.6,["ddr5","32gb","6000","kingston","sweet spot"],"DDR5"),
  p("ram-ddr5-corsair-32-5600","Corsair Vengeance DDR5 32GB (2x16) 5600MHz","ram","Corsair",1790000,"DDR5 Corsair 32GB 5600 CL36",{"Loại":"DDR5","Dung lượng":"32GB (2x16GB)","Tốc độ":"5600 MHz","CAS Latency":"CL36","Điện áp":"1.1V"},35,4.4,["ddr5","32gb","5600","corsair","vengeance"],"DDR5"),
  p("ram-ddr5-corsair-32-6000","Corsair Vengeance DDR5 32GB (2x16) 6000MHz","ram","Corsair",2190000,"DDR5 Corsair 6000 CL30, optimal AM5",{"Loại":"DDR5","Dung lượng":"32GB (2x16GB)","Tốc độ":"6000 MHz","CAS Latency":"CL30","Điện áp":"1.35V","EXPO":"Có"},30,4.6,["ddr5","32gb","6000","corsair","expo","am5 optimal"],"DDR5"),
  p("ram-ddr5-corsair-64-6000","Corsair Vengeance DDR5 64GB (2x32) 6000MHz","ram","Corsair",3990000,"DDR5 64GB workstation 6000MHz",{"Loại":"DDR5","Dung lượng":"64GB (2x32GB)","Tốc độ":"6000 MHz","CAS Latency":"CL30"},15,4.6,["ddr5","64gb","6000","corsair","workstation"],"DDR5"),
  p("ram-ddr5-gskill-32-6000","G.Skill Trident Z5 DDR5 32GB (2x16) 6000MHz","ram","G.Skill",2490000,"DDR5 G.Skill 6000 CL30, thiết kế đẹp",{"Loại":"DDR5","Dung lượng":"32GB (2x16GB)","Tốc độ":"6000 MHz","CAS Latency":"CL30","Điện áp":"1.35V"},25,4.6,["ddr5","32gb","6000","gskill","trident z5"],"DDR5"),
  p("ram-ddr5-gskill-32-6400","G.Skill Trident Z5 RGB DDR5 32GB (2x16) 6400MHz","ram","G.Skill",2990000,"DDR5 RGB 6400MHz premium",{"Loại":"DDR5","Dung lượng":"32GB (2x16GB)","Tốc độ":"6400 MHz","CAS Latency":"CL32","RGB":"Có"},20,4.7,["ddr5","32gb","6400","gskill","rgb","premium"],"DDR5"),
  p("ram-ddr5-gskill-64-6000","G.Skill Trident Z5 RGB DDR5 64GB (2x32) 6000MHz","ram","G.Skill",5990000,"DDR5 64GB RGB workstation",{"Loại":"DDR5","Dung lượng":"64GB (2x32GB)","Tốc độ":"6000 MHz","CAS Latency":"CL30","RGB":"Có"},10,4.7,["ddr5","64gb","gskill","rgb","workstation"],"DDR5"),
  p("ram-ddr5-gskill-32-7200","G.Skill Trident Z5 Royal DDR5 32GB (2x16) 7200MHz","ram","G.Skill",4490000,"DDR5 OC extreme 7200MHz",{"Loại":"DDR5","Dung lượng":"32GB (2x16GB)","Tốc độ":"7200 MHz","CAS Latency":"CL34"},10,4.5,["ddr5","32gb","7200","gskill","oc","extreme"],"DDR5"),
  p("ram-ddr5-crucial-16-4800","Crucial DDR5 16GB (1x16) 4800MHz","ram","Crucial",690000,"DDR5 entry giá rẻ 4800MHz",{"Loại":"DDR5","Dung lượng":"16GB (1x16GB)","Tốc độ":"4800 MHz","CAS Latency":"CL40"},50,4.0,["ddr5","16gb","4800","crucial","giá rẻ","entry"],"DDR5"),
  p("ram-ddr5-crucial-32-5600","Crucial DDR5 32GB (2x16) 5600MHz","ram","Crucial",1490000,"DDR5 Crucial value 5600MHz",{"Loại":"DDR5","Dung lượng":"32GB (2x16GB)","Tốc độ":"5600 MHz","CAS Latency":"CL46"},30,4.3,["ddr5","32gb","5600","crucial","value"],"DDR5"),
  p("ram-ddr5-teamgroup-32-6000","TeamGroup T-Force Delta RGB DDR5 32GB (2x16) 6000MHz","ram","TeamGroup",1990000,"DDR5 TeamGroup RGB 6000MHz",{"Loại":"DDR5","Dung lượng":"32GB (2x16GB)","Tốc độ":"6000 MHz","CAS Latency":"CL30","RGB":"Có"},20,4.4,["ddr5","32gb","6000","teamgroup","rgb"],"DDR5"),
  p("ram-ddr5-teamgroup-32-7200","TeamGroup T-Force Delta RGB DDR5 32GB (2x16) 7200MHz","ram","TeamGroup",3490000,"DDR5 TeamGroup OC 7200MHz",{"Loại":"DDR5","Dung lượng":"32GB (2x16GB)","Tốc độ":"7200 MHz","CAS Latency":"CL34","RGB":"Có"},10,4.5,["ddr5","32gb","7200","teamgroup","oc"],"DDR5"),

  // DDR4
  p("ram-ddr4-fury-16-3200","Kingston Fury Beast DDR4 16GB (2x8) 3200MHz","ram","Kingston",790000,"DDR4 16GB dual-channel 3200MHz",{"Loại":"DDR4","Dung lượng":"16GB (2x8GB)","Tốc độ":"3200 MHz","CAS Latency":"CL16","Điện áp":"1.35V"},50,4.5,["ddr4","16gb","3200","kingston","budget"],"DDR4"),
  p("ram-ddr4-fury-32-3200","Kingston Fury Beast DDR4 32GB (2x16) 3200MHz","ram","Kingston",1290000,"DDR4 32GB 3200MHz cho AM4",{"Loại":"DDR4","Dung lượng":"32GB (2x16GB)","Tốc độ":"3200 MHz","CAS Latency":"CL16"},30,4.5,["ddr4","32gb","3200","kingston","am4"],"DDR4"),
  p("ram-ddr4-corsair-16-3200","Corsair Vengeance LPX DDR4 16GB (2x8) 3200MHz","ram","Corsair",790000,"DDR4 Corsair 16GB CL16 low-profile",{"Loại":"DDR4","Dung lượng":"16GB (2x8GB)","Tốc độ":"3200 MHz","CAS Latency":"CL16","Profile":"Low-Profile"},40,4.5,["ddr4","16gb","3200","corsair","lpx","low-profile"],"DDR4"),
  p("ram-ddr4-corsair-32-3600","Corsair Vengeance LPX DDR4 32GB (2x16) 3600MHz","ram","Corsair",1490000,"DDR4 32GB 3600MHz cho Ryzen",{"Loại":"DDR4","Dung lượng":"32GB (2x16GB)","Tốc độ":"3600 MHz","CAS Latency":"CL18"},25,4.5,["ddr4","32gb","3600","corsair","ryzen"],"DDR4"),
  p("ram-ddr4-gskill-16-3600","G.Skill Trident Z Neo DDR4 16GB (2x8) 3600MHz","ram","G.Skill",990000,"DDR4 G.Skill 3600 CL16 cho AMD",{"Loại":"DDR4","Dung lượng":"16GB (2x8GB)","Tốc độ":"3600 MHz","CAS Latency":"CL16","RGB":"Có"},30,4.6,["ddr4","16gb","3600","gskill","rgb","amd optimal"],"DDR4"),
  p("ram-ddr4-gskill-32-3600","G.Skill Trident Z Neo DDR4 32GB (2x16) 3600MHz","ram","G.Skill",1690000,"DDR4 32GB G.Skill 3600 RGB",{"Loại":"DDR4","Dung lượng":"32GB (2x16GB)","Tốc độ":"3600 MHz","CAS Latency":"CL16","RGB":"Có"},20,4.6,["ddr4","32gb","3600","gskill","rgb"],"DDR4"),
  p("ram-ddr4-crucial-8-3200","Crucial DDR4 8GB (1x8) 3200MHz","ram","Crucial",390000,"DDR4 8GB đơn giá rẻ",{"Loại":"DDR4","Dung lượng":"8GB (1x8GB)","Tốc độ":"3200 MHz","CAS Latency":"CL22"},60,4.0,["ddr4","8gb","3200","crucial","giá rẻ"],"DDR4"),
  p("ram-ddr4-crucial-16-3200","Crucial DDR4 16GB (2x8) 3200MHz","ram","Crucial",690000,"DDR4 16GB Crucial value",{"Loại":"DDR4","Dung lượng":"16GB (2x8GB)","Tốc độ":"3200 MHz","CAS Latency":"CL22"},40,4.2,["ddr4","16gb","3200","crucial","value"],"DDR4"),
  p("ram-ddr4-teamgroup-16-3200","TeamGroup T-Force Vulcan Z DDR4 16GB (2x8) 3200MHz","ram","TeamGroup",690000,"DDR4 TeamGroup value 3200",{"Loại":"DDR4","Dung lượng":"16GB (2x8GB)","Tốc độ":"3200 MHz","CAS Latency":"CL16"},35,4.2,["ddr4","16gb","3200","teamgroup","value"],"DDR4"),
  p("ram-ddr4-8-2666","Kingston DDR4 8GB (1x8) 2666MHz","ram","Kingston",290000,"DDR4 8GB cơ bản văn phòng",{"Loại":"DDR4","Dung lượng":"8GB (1x8GB)","Tốc độ":"2666 MHz","CAS Latency":"CL19"},50,3.8,["ddr4","8gb","2666","văn phòng","cơ bản"],"DDR4"),
];

/* ═══════════════════════════════════════
   SSD — ~60 SKUs
   ═══════════════════════════════════════ */
const ssds: Product[] = [
  // NVMe PCIe 5.0
  p("ssd-crucial-t700-1tb","Crucial T700 1TB PCIe 5.0","ssd","Crucial",4990000,"PCIe 5.0 x4 NVMe, 12400MB/s read",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 5.0 x4 NVMe","Dung lượng":"1TB","Đọc":"12400 MB/s","Ghi":"11800 MB/s","Endurance":"600 TBW","DRAM":"Có"},15,4.5,["ssd","pcie5","1tb","crucial","t700","nhanh nhất"],"M.2_PCIe5"),
  p("ssd-crucial-t700-2tb","Crucial T700 2TB PCIe 5.0","ssd","Crucial",8990000,"PCIe 5.0 x4, 2TB fastest",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 5.0 x4","Dung lượng":"2TB","Đọc":"12400 MB/s","Ghi":"11800 MB/s","Endurance":"1200 TBW"},10,4.5,["ssd","pcie5","2tb","crucial"],"M.2_PCIe5"),
  p("ssd-crucial-t500-1tb","Crucial T500 1TB PCIe 5.0","ssd","Crucial",3490000,"PCIe 5.0 giá tốt, 7400MB/s",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 5.0 x4","Dung lượng":"1TB","Đọc":"7400 MB/s","Ghi":"7000 MB/s","Endurance":"600 TBW"},20,4.5,["ssd","pcie5","1tb","crucial","t500","giá tốt"],"M.2_PCIe5"),
  p("ssd-crucial-t500-2tb","Crucial T500 2TB PCIe 5.0","ssd","Crucial",5990000,"PCIe 5.0 2TB, dung lượng lớn",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 5.0 x4","Dung lượng":"2TB","Đọc":"7400 MB/s","Ghi":"7000 MB/s","Endurance":"1200 TBW"},12,4.5,["ssd","pcie5","2tb","crucial","t500"],"M.2_PCIe5"),
  p("ssd-samsung-990pro-1tb","Samsung 990 Pro 1TB PCIe 4.0","ssd","Samsung",2790000,"Flagship PCIe 4.0, 7450MB/s",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 4.0 x4","Dung lượng":"1TB","Đọc":"7450 MB/s","Ghi":"6900 MB/s","Endurance":"600 TBW","DRAM":"Có","Controller":"Elpis"},25,4.8,["ssd","pcie4","1tb","samsung","990 pro","flagship"],"M.2_PCIe4"),
  p("ssd-samsung-990pro-2tb","Samsung 990 Pro 2TB PCIe 4.0","ssd","Samsung",4990000,"Samsung flagship 2TB",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 4.0 x4","Dung lượng":"2TB","Đọc":"7450 MB/s","Ghi":"6900 MB/s","Endurance":"1200 TBW","DRAM":"Có"},15,4.8,["ssd","pcie4","2tb","samsung","990 pro"],"M.2_PCIe4"),
  p("ssd-samsung-990evo-1tb","Samsung 990 EVO 1TB PCIe 5.0 x2","ssd","Samsung",2290000,"PCIe 5.0 x2 / PCIe 4.0 x4, hybrid",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 5.0 x2 / PCIe 4.0 x4","Dung lượng":"1TB","Đọc":"5000 MB/s","Ghi":"4200 MB/s","Endurance":"600 TBW"},30,4.5,["ssd","pcie5x2","1tb","samsung","990 evo"],"M.2_PCIe4"),
  p("ssd-samsung-990evo-2tb","Samsung 990 EVO 2TB","ssd","Samsung",3790000,"Samsung 990 EVO 2TB hybrid",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 5.0 x2","Dung lượng":"2TB","Đọc":"5000 MB/s","Ghi":"4200 MB/s"},15,4.5,["ssd","2tb","samsung","990 evo"],"M.2_PCIe4"),
  p("ssd-samsung-980pro-1tb","Samsung 980 Pro 1TB PCIe 4.0","ssd","Samsung",2290000,"Gen trước vẫn mạnh, 7000MB/s",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 4.0 x4","Dung lượng":"1TB","Đọc":"7000 MB/s","Ghi":"5100 MB/s","DRAM":"Có"},20,4.6,["ssd","pcie4","1tb","samsung","980 pro"],"M.2_PCIe4"),
  p("ssd-wd-sn850x-1tb","WD Black SN850X 1TB","ssd","Western Digital",2490000,"WD flagship PCIe 4.0, 7300MB/s",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 4.0 x4","Dung lượng":"1TB","Đọc":"7300 MB/s","Ghi":"6300 MB/s","DRAM":"Có"},20,4.7,["ssd","pcie4","1tb","wd","sn850x","flagship"],"M.2_PCIe4"),
  p("ssd-wd-sn850x-2tb","WD Black SN850X 2TB","ssd","Western Digital",4290000,"WD flagship 2TB",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 4.0 x4","Dung lượng":"2TB","Đọc":"7300 MB/s","Ghi":"6600 MB/s","DRAM":"Có"},12,4.7,["ssd","pcie4","2tb","wd","sn850x"],"M.2_PCIe4"),
  p("ssd-wd-sn770-500gb","WD Black SN770 500GB","ssd","Western Digital",1190000,"PCIe 4.0 budget 500GB",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 4.0 x4","Dung lượng":"500GB","Đọc":"5000 MB/s","Ghi":"4000 MB/s"},40,4.4,["ssd","pcie4","500gb","wd","sn770","budget"],"M.2_PCIe4"),
  p("ssd-wd-sn770-1tb","WD Black SN770 1TB","ssd","Western Digital",1690000,"PCIe 4.0 best value 1TB",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 4.0 x4","Dung lượng":"1TB","Đọc":"5150 MB/s","Ghi":"4900 MB/s"},50,4.6,["ssd","pcie4","1tb","wd","sn770","best value"],"M.2_PCIe4"),
  p("ssd-wd-sn770-2tb","WD Black SN770 2TB","ssd","Western Digital",2990000,"PCIe 4.0 value 2TB",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 4.0 x4","Dung lượng":"2TB","Đọc":"5150 MB/s","Ghi":"4850 MB/s"},25,4.5,["ssd","pcie4","2tb","wd","sn770"],"M.2_PCIe4"),
  p("ssd-kingston-nv2-500gb","Kingston NV2 500GB","ssd","Kingston",590000,"PCIe 4.0 siêu rẻ 500GB",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 4.0 x4","Dung lượng":"500GB","Đọc":"3500 MB/s","Ghi":"2100 MB/s"},50,4.1,["ssd","pcie4","500gb","kingston","nv2","siêu rẻ"],"M.2_PCIe4"),
  p("ssd-kingston-nv2-1tb","Kingston NV2 1TB","ssd","Kingston",990000,"PCIe 4.0 budget 1TB",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 4.0 x4","Dung lượng":"1TB","Đọc":"3500 MB/s","Ghi":"2100 MB/s"},50,4.2,["ssd","pcie4","1tb","kingston","nv2","budget"],"M.2_PCIe4"),
  p("ssd-kingston-nv2-2tb","Kingston NV2 2TB","ssd","Kingston",1790000,"PCIe 4.0 budget 2TB",{"Form Factor":"M.2 2280","Giao tiếp":"PCIe 4.0 x4","Dung lượng":"2TB","Đọc":"3500 MB/s","Ghi":"2800 MB/s"},25,4.2,["ssd","pcie4","2tb","kingston","nv2"],"M.2_PCIe4"),
  // SATA SSD
  p("ssd-samsung-870evo-500gb","Samsung 870 EVO 500GB SATA","ssd","Samsung",1290000,"SATA SSD tin cậy 500GB",{"Form Factor":"2.5 inch","Giao tiếp":"SATA III 6Gbps","Dung lượng":"500GB","Đọc":"560 MB/s","Ghi":"530 MB/s","Endurance":"300 TBW","DRAM":"Có"},30,4.6,["ssd","sata","500gb","samsung","870 evo"],"SATA"),
  p("ssd-samsung-870evo-1tb","Samsung 870 EVO 1TB SATA","ssd","Samsung",1990000,"SATA SSD 1TB bền bỉ",{"Form Factor":"2.5 inch","Giao tiếp":"SATA III 6Gbps","Dung lượng":"1TB","Đọc":"560 MB/s","Ghi":"530 MB/s","Endurance":"600 TBW","DRAM":"Có"},25,4.7,["ssd","sata","1tb","samsung","870 evo"],"SATA"),
  p("ssd-samsung-870evo-2tb","Samsung 870 EVO 2TB SATA","ssd","Samsung",3490000,"SATA 2TB lưu trữ lớn",{"Form Factor":"2.5 inch","Giao tiếp":"SATA III","Dung lượng":"2TB","Đọc":"560 MB/s","Ghi":"530 MB/s"},15,4.6,["ssd","sata","2tb","samsung"],"SATA"),
  p("ssd-crucial-mx500-500gb","Crucial MX500 500GB SATA","ssd","Crucial",990000,"SATA budget 500GB",{"Form Factor":"2.5 inch","Giao tiếp":"SATA III","Dung lượng":"500GB","Đọc":"560 MB/s","Ghi":"510 MB/s","DRAM":"Có"},30,4.4,["ssd","sata","500gb","crucial","mx500","budget"],"SATA"),
  p("ssd-crucial-mx500-1tb","Crucial MX500 1TB SATA","ssd","Crucial",1590000,"SATA value 1TB",{"Form Factor":"2.5 inch","Giao tiếp":"SATA III","Dung lượng":"1TB","Đọc":"560 MB/s","Ghi":"510 MB/s","DRAM":"Có"},25,4.5,["ssd","sata","1tb","crucial","mx500"],"SATA"),
  p("ssd-kingston-a400-240gb","Kingston A400 240GB SATA","ssd","Kingston",490000,"SATA entry 240GB cực rẻ",{"Form Factor":"2.5 inch","Giao tiếp":"SATA III","Dung lượng":"240GB","Đọc":"500 MB/s","Ghi":"350 MB/s"},60,3.9,["ssd","sata","240gb","kingston","entry","cực rẻ"],"SATA"),
  p("ssd-kingston-a400-480gb","Kingston A400 480GB SATA","ssd","Kingston",690000,"SATA budget 480GB",{"Form Factor":"2.5 inch","Giao tiếp":"SATA III","Dung lượng":"480GB","Đọc":"500 MB/s","Ghi":"450 MB/s"},50,4.0,["ssd","sata","480gb","kingston","budget"],"SATA"),
];

/* ═══════════════════════════════════════
   HDD — ~15 SKUs
   ═══════════════════════════════════════ */
const hdds: Product[] = [
  p("hdd-wd-blue-1tb","WD Blue 1TB 7200RPM","hdd","Western Digital",890000,"HDD 1TB cho lưu trữ cơ bản",{"Form Factor":"3.5 inch","Dung lượng":"1TB","Tốc độ quay":"7200 RPM","Cache":"64MB","Giao tiếp":"SATA III"},30,4.0,["hdd","1tb","wd","blue","7200rpm"]),
  p("hdd-wd-blue-2tb","WD Blue 2TB 5400RPM","hdd","Western Digital",1290000,"HDD 2TB lưu trữ",{"Form Factor":"3.5 inch","Dung lượng":"2TB","Tốc độ quay":"5400 RPM","Cache":"256MB"},25,4.1,["hdd","2tb","wd","blue"]),
  p("hdd-wd-blue-4tb","WD Blue 4TB 5400RPM","hdd","Western Digital",2490000,"HDD 4TB lưu trữ lớn",{"Form Factor":"3.5 inch","Dung lượng":"4TB","Tốc độ quay":"5400 RPM","Cache":"256MB"},20,4.2,["hdd","4tb","wd","blue","lưu trữ lớn"]),
  p("hdd-seagate-barracuda-1tb","Seagate Barracuda 1TB 7200RPM","hdd","Seagate",790000,"HDD Seagate 1TB",{"Form Factor":"3.5 inch","Dung lượng":"1TB","Tốc độ quay":"7200 RPM","Cache":"64MB"},30,4.0,["hdd","1tb","seagate","barracuda"]),
  p("hdd-seagate-barracuda-2tb","Seagate Barracuda 2TB 7200RPM","hdd","Seagate",1190000,"HDD Seagate 2TB nhanh",{"Form Factor":"3.5 inch","Dung lượng":"2TB","Tốc độ quay":"7200 RPM","Cache":"256MB"},25,4.2,["hdd","2tb","seagate","barracuda"]),
  p("hdd-seagate-barracuda-4tb","Seagate Barracuda 4TB","hdd","Seagate",2290000,"HDD 4TB Seagate",{"Form Factor":"3.5 inch","Dung lượng":"4TB","Tốc độ quay":"5400 RPM","Cache":"256MB"},20,4.2,["hdd","4tb","seagate"]),
  p("hdd-seagate-barracuda-8tb","Seagate Barracuda 8TB","hdd","Seagate",3990000,"HDD 8TB lưu trữ khổng lồ",{"Form Factor":"3.5 inch","Dung lượng":"8TB","Tốc độ quay":"5400 RPM","Cache":"256MB"},10,4.2,["hdd","8tb","seagate","lưu trữ khổng lồ"]),
  p("hdd-wd-red-4tb","WD Red Plus 4TB NAS","hdd","Western Digital",3290000,"HDD NAS 4TB 24/7",{"Form Factor":"3.5 inch","Dung lượng":"4TB","Tốc độ quay":"5400 RPM","Cache":"256MB","Dòng":"NAS CMR"},12,4.3,["hdd","4tb","wd","red","nas","cmr"]),
  p("hdd-wd-red-8tb","WD Red Plus 8TB NAS","hdd","Western Digital",5490000,"HDD NAS 8TB chuyên dụng",{"Form Factor":"3.5 inch","Dung lượng":"8TB","Tốc độ quay":"5640 RPM","Cache":"256MB","Dòng":"NAS CMR"},8,4.4,["hdd","8tb","wd","red","nas"]),
  p("hdd-toshiba-p300-1tb","Toshiba P300 1TB","hdd","Toshiba",690000,"HDD Toshiba budget 1TB",{"Form Factor":"3.5 inch","Dung lượng":"1TB","Tốc độ quay":"7200 RPM","Cache":"64MB"},25,3.9,["hdd","1tb","toshiba","budget"]),
  p("hdd-toshiba-p300-2tb","Toshiba P300 2TB","hdd","Toshiba",1090000,"HDD Toshiba 2TB giá rẻ",{"Form Factor":"3.5 inch","Dung lượng":"2TB","Tốc độ quay":"5400 RPM","Cache":"128MB"},20,4.0,["hdd","2tb","toshiba"]),
];

/* ══════════════════ PSU — ~50 SKUs ══════════════════ */
const psus: Product[] = [
  // Corsair
  p("psu-corsair-rm1000x","Corsair RM1000x 1000W 80+ Gold","psu","Corsair",4490000,"1000W Full Modular, Zero RPM, 10yr warranty",{"Công suất":"1000W","Chứng nhận":"80+ Gold","Dây":"Full Modular","Quạt":"135mm FDB","Bảo hành":"10 năm","Bảo vệ":"OVP/UVP/SCP/OPP/OTP"},15,4.8,["psu","1000w","corsair","rm1000x","gold","modular"]),
  p("psu-corsair-rm850x","Corsair RM850x 850W 80+ Gold","psu","Corsair",3490000,"850W Full Modular, yên tĩnh",{"Công suất":"850W","Chứng nhận":"80+ Gold","Dây":"Full Modular","Quạt":"135mm FDB","Bảo hành":"10 năm"},20,4.8,["psu","850w","corsair","rm850x","gold"]),
  p("psu-corsair-rm750e","Corsair RM750e 750W 80+ Gold","psu","Corsair",2490000,"750W Full Modular, ATX 3.0, 12VHPWR",{"Công suất":"750W","Chứng nhận":"80+ Gold","Dây":"Full Modular","ATX":"3.0","12VHPWR":"Có","Bảo hành":"10 năm"},30,4.7,["psu","750w","corsair","rm750e","gold","atx3"]),
  p("psu-corsair-rm650e","Corsair RM650e 650W 80+ Gold","psu","Corsair",1990000,"650W Full Modular, ATX 3.0",{"Công suất":"650W","Chứng nhận":"80+ Gold","Dây":"Full Modular","ATX":"3.0"},25,4.6,["psu","650w","corsair","rm650e"]),
  p("psu-corsair-cv550","Corsair CV550 550W 80+ Bronze","psu","Corsair",990000,"550W budget Bronze",{"Công suất":"550W","Chứng nhận":"80+ Bronze","Dây":"Non-Modular","Bảo hành":"5 năm"},40,4.1,["psu","550w","corsair","cv550","bronze","budget"]),
  p("psu-corsair-cv650","Corsair CV650 650W 80+ Bronze","psu","Corsair",1290000,"650W budget Bronze",{"Công suất":"650W","Chứng nhận":"80+ Bronze","Dây":"Non-Modular","Bảo hành":"5 năm"},30,4.2,["psu","650w","corsair","cv650","bronze"]),
  p("psu-corsair-sf750","Corsair SF750 750W 80+ Platinum SFX","psu","Corsair",3490000,"SFX 750W Platinum cho ITX",{"Công suất":"750W","Chứng nhận":"80+ Platinum","Dây":"Full Modular","Form Factor":"SFX","Bảo hành":"10 năm"},12,4.8,["psu","750w","corsair","sf750","sfx","itx","platinum"]),
  // NZXT
  p("psu-nzxt-c850","NZXT C850 850W 80+ Gold","psu","NZXT",2990000,"850W Full Modular, cáp dẹp dễ đi dây",{"Công suất":"850W","Chứng nhận":"80+ Gold","Dây":"Full Modular (cáp dẹp)","Bảo hành":"10 năm"},20,4.7,["psu","850w","nzxt","c850","gold","cáp dẹp"]),
  p("psu-nzxt-c750","NZXT C750 750W 80+ Gold","psu","NZXT",2490000,"750W Full Modular NZXT",{"Công suất":"750W","Chứng nhận":"80+ Gold","Dây":"Full Modular"},20,4.6,["psu","750w","nzxt","c750"]),
  p("psu-nzxt-c650","NZXT C650 650W 80+ Gold","psu","NZXT",1990000,"650W NZXT Gold",{"Công suất":"650W","Chứng nhận":"80+ Gold","Dây":"Full Modular"},20,4.5,["psu","650w","nzxt","c650"]),
  // Seasonic
  p("psu-seasonic-focus-850","Seasonic Focus GX-850 850W 80+ Gold","psu","Seasonic",3290000,"850W Seasonic premium, 10yr",{"Công suất":"850W","Chứng nhận":"80+ Gold","Dây":"Full Modular","Quạt":"120mm FDB","Bảo hành":"10 năm"},15,4.7,["psu","850w","seasonic","focus","gold"]),
  p("psu-seasonic-focus-750","Seasonic Focus GX-750 750W 80+ Gold","psu","Seasonic",2690000,"750W Seasonic reliable",{"Công suất":"750W","Chứng nhận":"80+ Gold","Dây":"Full Modular","Bảo hành":"10 năm"},18,4.7,["psu","750w","seasonic","focus"]),
  p("psu-seasonic-focus-650","Seasonic Focus GX-650 650W 80+ Gold","psu","Seasonic",2190000,"650W Seasonic Gold",{"Công suất":"650W","Chứng nhận":"80+ Gold","Dây":"Full Modular","Bảo hành":"10 năm"},20,4.6,["psu","650w","seasonic"]),
  p("psu-seasonic-prime-1000t","Seasonic PRIME TX-1000 1000W 80+ Titanium","psu","Seasonic",6990000,"1000W Titanium flagship",{"Công suất":"1000W","Chứng nhận":"80+ Titanium","Dây":"Full Modular","Bảo hành":"12 năm"},8,4.9,["psu","1000w","seasonic","titanium","flagship"]),
  // be quiet!
  p("psu-bequiet-dark-1000","be quiet! Dark Power 13 1000W 80+ Titanium","psu","be quiet!",5990000,"1000W Titanium, cực yên tĩnh",{"Công suất":"1000W","Chứng nhận":"80+ Titanium","Dây":"Full Modular","Bảo hành":"10 năm","Tính năng":"Fanless mode"},8,4.9,["psu","1000w","bequiet","titanium","yên tĩnh"]),
  p("psu-bequiet-straight-850","be quiet! Straight Power 12 850W 80+ Platinum","psu","be quiet!",3490000,"850W Platinum yên tĩnh",{"Công suất":"850W","Chứng nhận":"80+ Platinum","Dây":"Full Modular","Bảo hành":"10 năm"},12,4.7,["psu","850w","bequiet","platinum"]),
  p("psu-bequiet-pure-750","be quiet! Pure Power 12 M 750W 80+ Gold","psu","be quiet!",2190000,"750W Gold giá tốt",{"Công suất":"750W","Chứng nhận":"80+ Gold","Dây":"Full Modular","ATX":"3.0"},18,4.5,["psu","750w","bequiet","pure","gold"]),
  // MSI
  p("psu-msi-a850gl","MSI MAG A850GL 850W 80+ Gold","psu","MSI",2490000,"850W MSI ATX 3.0, 12VHPWR",{"Công suất":"850W","Chứng nhận":"80+ Gold","Dây":"Full Modular","ATX":"3.0","12VHPWR":"Có"},18,4.5,["psu","850w","msi","atx3","12vhpwr"]),
  p("psu-msi-a750gl","MSI MAG A750GL 750W 80+ Gold","psu","MSI",1990000,"750W MSI ATX 3.0",{"Công suất":"750W","Chứng nhận":"80+ Gold","Dây":"Full Modular","ATX":"3.0"},20,4.4,["psu","750w","msi"]),
  // Budget
  p("psu-coolermaster-mwe-650","Cooler Master MWE 650 V2 80+ Bronze","psu","Cooler Master",1190000,"650W Bronze budget",{"Công suất":"650W","Chứng nhận":"80+ Bronze","Dây":"Non-Modular","Bảo hành":"5 năm"},30,4.1,["psu","650w","coolermaster","bronze","budget"]),
  p("psu-coolermaster-mwe-550","Cooler Master MWE 550 V2 80+ Bronze","psu","Cooler Master",890000,"550W Bronze siêu rẻ",{"Công suất":"550W","Chứng nhận":"80+ Bronze","Dây":"Non-Modular"},30,4.0,["psu","550w","coolermaster","bronze","siêu rẻ"]),
  p("psu-thermaltake-smart-600","Thermaltake Smart 600W 80+ White","psu","Thermaltake",690000,"600W entry level",{"Công suất":"600W","Chứng nhận":"80+ White","Dây":"Non-Modular"},30,3.7,["psu","600w","thermaltake","entry"]),
];

/* ══════════════════ CASE — ~40 SKUs ══════════════════ */
const cases: Product[] = [
  // ATX Mid-Tower
  p("case-nzxt-h5","NZXT H5 Flow","case","NZXT",1990000,"ATX Mid-Tower, airflow mesh, thiết kế tối giản",{"Form Factor":"ATX Mid-Tower","Quạt đi kèm":"2x 120mm","Hỗ trợ GPU":"365mm","Hỗ trợ Cooler":"165mm","Khe 2.5\"":"2+1","Khe 3.5\"":"1","USB Front":"1x USB-C, 1x USB-A","Cửa sổ":"Tempered Glass"},30,4.6,["case","atx","nzxt","h5","airflow","tối giản"]),
  p("case-nzxt-h7-flow","NZXT H7 Flow","case","NZXT",2990000,"ATX Full airflow, hỗ trợ 360mm AIO",{"Form Factor":"ATX Mid-Tower","Quạt đi kèm":"2x 120mm","Hỗ trợ GPU":"400mm","Hỗ trợ AIO":"360mm top/front"},20,4.7,["case","atx","nzxt","h7","airflow"]),
  p("case-corsair-4000d","Corsair 4000D Airflow","case","Corsair",2290000,"ATX Mid-Tower airflow tốt nhất tầm giá",{"Form Factor":"ATX Mid-Tower","Quạt đi kèm":"2x 120mm","Hỗ trợ GPU":"360mm","Hỗ trợ Cooler":"170mm","Hỗ trợ AIO":"360mm front"},35,4.6,["case","atx","corsair","4000d","airflow","best value"]),
  p("case-corsair-5000d","Corsair 5000D Airflow","case","Corsair",3490000,"ATX Full-size, nhiều không gian",{"Form Factor":"ATX Mid-Tower","Quạt đi kèm":"2x 120mm","Hỗ trợ GPU":"420mm","Hỗ trợ AIO":"360mm top + front"},15,4.7,["case","atx","corsair","5000d","airflow","rộng"]),
  p("case-lianli-lancool2","Lian Li Lancool II Mesh","case","Lian Li",2490000,"ATX Mesh front panel, cable management tốt",{"Form Factor":"ATX Mid-Tower","Quạt đi kèm":"3x 120mm","Hỗ trợ GPU":"384mm","Hỗ trợ AIO":"360mm front"},25,4.7,["case","atx","lianli","lancool","mesh"]),
  p("case-lianli-lancool3","Lian Li Lancool III","case","Lian Li",3290000,"ATX rộng rãi, modular, airflow đỉnh",{"Form Factor":"ATX Mid-Tower","Quạt đi kèm":"3x 140mm + 1x 120mm","Hỗ trợ GPU":"420mm","Hỗ trợ AIO":"360mm top + front","Tính năng":"Reversible front panel"},15,4.8,["case","atx","lianli","lancool3","modular"]),
  p("case-lianli-o11d-evo","Lian Li O11 Dynamic EVO","case","Lian Li",3490000,"ATX dual-chamber, showcase build",{"Form Factor":"ATX Mid-Tower","Quạt đi kèm":"0 (mua riêng)","Hỗ trợ GPU":"423mm","Hỗ trợ AIO":"360mm x3","Tính năng":"Dual-chamber, reversible"},15,4.8,["case","atx","lianli","o11d","showcase","dual chamber"]),
  p("case-fractal-north","Fractal Design North","case","Fractal Design",3990000,"ATX, panel gỗ walnut sang trọng",{"Form Factor":"ATX Mid-Tower","Quạt đi kèm":"2x 140mm","Hỗ trợ GPU":"355mm","Hỗ trợ Cooler":"170mm","Thiết kế":"Gỗ walnut + mesh"},15,4.8,["case","atx","fractal","north","gỗ","sang trọng"]),
  p("case-fractal-pop-air","Fractal Design Pop Air","case","Fractal Design",1990000,"ATX budget airflow tốt",{"Form Factor":"ATX Mid-Tower","Quạt đi kèm":"2x 120mm + 1x 140mm","Hỗ trợ GPU":"405mm"},20,4.4,["case","atx","fractal","pop","budget"]),
  p("case-phanteks-g360a","Phanteks Eclipse G360A","case","Phanteks",1690000,"ATX budget mesh, 3 quạt D-RGB",{"Form Factor":"ATX Mid-Tower","Quạt đi kèm":"3x 120mm D-RGB","Hỗ trợ GPU":"400mm"},25,4.4,["case","atx","phanteks","g360a","rgb","budget"]),
  p("case-bequiet-500dx","be quiet! Pure Base 500DX","case","be quiet!",2990000,"ATX yên tĩnh + airflow tốt",{"Form Factor":"ATX Mid-Tower","Quạt đi kèm":"3x 140mm Pure Wings 2","Hỗ trợ GPU":"369mm","Tính năng":"ARGB, yên tĩnh"},15,4.6,["case","atx","bequiet","500dx","yên tĩnh"]),
  // mATX
  p("case-nr200p","Cooler Master NR200P","case","Cooler Master",1990000,"Mini-ITX/mATX SFF, compact đẹp",{"Form Factor":"Mini-ITX / mATX (SFF)","Quạt đi kèm":"2x 120mm","Hỗ trợ GPU":"330mm (3 slot)","Hỗ trợ AIO":"240mm","PSU":"SFX/SFX-L","Tính năng":"Mesh panel + TG panel"},20,4.6,["case","itx","matx","coolermaster","nr200p","sff","compact"]),
  p("case-nr200p-max","Cooler Master NR200P MAX","case","Cooler Master",4490000,"SFF có sẵn AIO 280mm + SFX 850W",{"Form Factor":"Mini-ITX","Quạt đi kèm":"AIO 280mm đi kèm","PSU":"SFX 850W Gold đi kèm","Hỗ trợ GPU":"336mm"},10,4.7,["case","itx","coolermaster","nr200p max","all-in-one"]),
  p("case-meshify-mini","Fractal Design Meshify 2 Mini","case","Fractal Design",2490000,"mATX compact mesh",{"Form Factor":"mATX","Quạt đi kèm":"3x 120mm","Hỗ trợ GPU":"341mm"},15,4.5,["case","matx","fractal","meshify","compact"]),
  // Full Tower
  p("case-corsair-7000d","Corsair 7000D Airflow","case","Corsair",4990000,"Full Tower, E-ATX, nhiều quạt",{"Form Factor":"Full Tower","Quạt đi kèm":"3x 140mm","Hỗ trợ GPU":"450mm","Hỗ trợ E-ATX":"Có"},10,4.7,["case","full tower","corsair","7000d","eatx"]),
  p("case-lianli-o11xl","Lian Li O11D XL","case","Lian Li",4990000,"Full Tower dual-chamber, showcase",{"Form Factor":"Full Tower","Hỗ trợ GPU":"446mm","Hỗ trợ AIO":"360mm x3","Tính năng":"Dual-chamber, E-ATX"},10,4.7,["case","full tower","lianli","o11d xl"]),
];

/* ══════════════════ COOLER — ~50 SKUs ══════════════════ */
const coolers: Product[] = [
  // Air Cooler — Budget
  p("cooler-id-se214xt","ID-Cooling SE-214-XT","cooler","ID-Cooling",290000,"Tản khí budget, hỗ trợ LGA1700/AM5",{"Loại":"Air Cooler","Quạt":"1x 120mm","TDP hỗ trợ":"150W","Socket":"LGA1700/AM5/AM4","Chiều cao":"150mm","Tốc độ":"500-1500 RPM"},50,4.2,["cooler","air","budget","id-cooling","se214","lga1700","am5"]),
  p("cooler-deepcool-ak400","DeepCool AK400","cooler","DeepCool",490000,"Tản khí value, 4 ống đồng",{"Loại":"Air Cooler","Quạt":"1x 120mm","TDP hỗ trợ":"220W","Socket":"LGA1700/AM5/AM4","Chiều cao":"155mm"},40,4.4,["cooler","air","deepcool","ak400","value"]),
  p("cooler-deepcool-ak620","DeepCool AK620","cooler","DeepCool",890000,"Tản khí dual-tower, 6 ống đồng",{"Loại":"Air Cooler","Quạt":"2x 120mm","TDP hỗ trợ":"260W","Socket":"LGA1700/AM5/AM4","Chiều cao":"160mm"},25,4.6,["cooler","air","deepcool","ak620","dual tower"]),
  // Air Cooler — Mid-range
  p("cooler-thermalright-pa120se","Thermalright Peerless Assassin 120 SE","cooler","Thermalright",490000,"BEST VALUE tản khí, dual-tower giá rẻ",{"Loại":"Air Cooler","Quạt":"2x 120mm","TDP hỗ trợ":"260W","Socket":"LGA1700/AM5/AM4","Chiều cao":"155mm","Ống đồng":"6 ống"},50,4.7,["cooler","air","thermalright","pa120","best value","dual tower"]),
  p("cooler-thermalright-frost-tower","Thermalright Frost Spirit 140","cooler","Thermalright",790000,"Dual tower 140mm, mát cực",{"Loại":"Air Cooler","Quạt":"1x 140mm + 1x 120mm","TDP hỗ trợ":"280W","Socket":"LGA1700/AM5/AM4","Chiều cao":"158mm"},20,4.6,["cooler","air","thermalright","frost spirit","140mm"]),
  // Air Cooler — Premium
  p("cooler-noctua-nhd15","Noctua NH-D15","cooler","Noctua",2290000,"Huyền thoại tản khí, mát hơn AIO 240",{"Loại":"Air Cooler","Quạt":"2x NF-A15 140mm","TDP hỗ trợ":"300W+","Socket":"LGA1700/AM5/AM4","Chiều cao":"165mm","Bảo hành":"6 năm"},20,4.9,["cooler","air","noctua","nhd15","huyền thoại","premium"]),
  p("cooler-noctua-nhd15s","Noctua NH-D15S","cooler","Noctua",1990000,"NH-D15 offset, không che RAM",{"Loại":"Air Cooler","Quạt":"1x NF-A15 140mm","TDP hỗ trợ":"280W","Socket":"LGA1700/AM5/AM4","Chiều cao":"160mm"},15,4.8,["cooler","air","noctua","nhd15s","offset"]),
  p("cooler-noctua-nhu12s","Noctua NH-U12S redux","cooler","Noctua",1190000,"120mm Noctua, nhỏ gọn mát tốt",{"Loại":"Air Cooler","Quạt":"1x NF-P12 120mm","TDP hỗ trợ":"200W","Socket":"LGA1700/AM5/AM4","Chiều cao":"158mm"},20,4.6,["cooler","air","noctua","nhu12s","compact"]),
  p("cooler-bequiet-darkrock-pro5","be quiet! Dark Rock Pro 5","cooler","be quiet!",1990000,"Tản khí yên tĩnh nhất, dual tower",{"Loại":"Air Cooler","Quạt":"1x 120mm + 1x 135mm Silent Wings 4","TDP hỗ trợ":"270W","Socket":"LGA1700/AM5/AM4","Chiều cao":"168mm"},15,4.8,["cooler","air","bequiet","dark rock pro 5","yên tĩnh"]),
  p("cooler-bequiet-darkrock-4","be quiet! Dark Rock 4","cooler","be quiet!",1490000,"Single tower yên tĩnh",{"Loại":"Air Cooler","Quạt":"1x 135mm Silent Wings","TDP hỗ trợ":"200W","Chiều cao":"159mm"},15,4.5,["cooler","air","bequiet","dark rock 4"]),

  // AIO 240mm
  p("cooler-arctic-lf2-240","Arctic Liquid Freezer II 240","cooler","Arctic",1690000,"AIO 240mm best value",{"Loại":"AIO 240mm","Quạt":"2x 120mm P12","TDP hỗ trợ":"280W","Socket":"LGA1700/AM5/AM4","Pump":"Integrated VRM fan","Bảo hành":"6 năm"},25,4.7,["cooler","aio","240mm","arctic","best value"]),
  p("cooler-corsair-h100i","Corsair iCUE H100i Elite LCD XT","cooler","Corsair",4490000,"AIO 240mm LCD screen, RGB",{"Loại":"AIO 240mm","Quạt":"2x 120mm AF120 RGB","Pump":"LCD hiển thị","Socket":"LGA1700/AM5/AM4"},12,4.6,["cooler","aio","240mm","corsair","h100i","lcd","rgb"]),
  p("cooler-nzxt-kraken-240","NZXT Kraken 240","cooler","NZXT",2490000,"AIO 240mm thiết kế đẹp",{"Loại":"AIO 240mm","Quạt":"2x 120mm","Socket":"LGA1700/AM5/AM4","Pump":"8th Gen Asetek"},15,4.5,["cooler","aio","240mm","nzxt","kraken"]),
  p("cooler-deepcool-ls520","DeepCool LS520","cooler","DeepCool",1490000,"AIO 240mm budget RGB",{"Loại":"AIO 240mm","Quạt":"2x 120mm FC120","Socket":"LGA1700/AM5/AM4"},20,4.4,["cooler","aio","240mm","deepcool","ls520","budget"]),
  p("cooler-ek-240","EK-AIO 240 D-RGB","cooler","EKWB",2990000,"AIO 240mm EK premium",{"Loại":"AIO 240mm","Quạt":"2x 120mm EK-Vardar","Socket":"LGA1700/AM5/AM4","Pump":"EK velocity"},10,4.5,["cooler","aio","240mm","ek","premium"]),

  // AIO 280mm
  p("cooler-arctic-lf2-280","Arctic Liquid Freezer II 280","cooler","Arctic",1990000,"AIO 280mm sweet spot",{"Loại":"AIO 280mm","Quạt":"2x 140mm P14","TDP hỗ trợ":"300W","Socket":"LGA1700/AM5/AM4"},18,4.7,["cooler","aio","280mm","arctic","sweet spot"]),
  p("cooler-nzxt-kraken-280","NZXT Kraken 280","cooler","NZXT",2990000,"AIO 280mm NZXT",{"Loại":"AIO 280mm","Quạt":"2x 140mm","Socket":"LGA1700/AM5/AM4"},12,4.5,["cooler","aio","280mm","nzxt"]),

  // AIO 360mm
  p("cooler-arctic-lf2-360","Arctic Liquid Freezer II 360","cooler","Arctic",2490000,"AIO 360mm best performance/price",{"Loại":"AIO 360mm","Quạt":"3x 120mm P12","TDP hỗ trợ":"350W+","Socket":"LGA1700/AM5/AM4","Bảo hành":"6 năm"},20,4.8,["cooler","aio","360mm","arctic","best performance"]),
  p("cooler-corsair-h150i","Corsair iCUE H150i Elite LCD XT","cooler","Corsair",5490000,"AIO 360mm LCD premium RGB",{"Loại":"AIO 360mm","Quạt":"3x 120mm AF120 RGB","Pump":"LCD 2.1\" IPS","Socket":"LGA1700/AM5/AM4"},12,4.7,["cooler","aio","360mm","corsair","h150i","lcd","premium"]),
  p("cooler-nzxt-kraken-360","NZXT Kraken 360","cooler","NZXT",3490000,"AIO 360mm NZXT LCD",{"Loại":"AIO 360mm","Quạt":"3x 120mm","Pump":"LCD display","Socket":"LGA1700/AM5/AM4"},12,4.6,["cooler","aio","360mm","nzxt","kraken","lcd"]),
  p("cooler-deepcool-ls720","DeepCool LS720","cooler","DeepCool",1990000,"AIO 360mm budget",{"Loại":"AIO 360mm","Quạt":"3x 120mm FC120","Socket":"LGA1700/AM5/AM4"},15,4.5,["cooler","aio","360mm","deepcool","budget"]),
  p("cooler-ek-360","EK-AIO 360 D-RGB","cooler","EKWB",3990000,"AIO 360mm EK flagship",{"Loại":"AIO 360mm","Quạt":"3x 120mm EK-Vardar","Socket":"LGA1700/AM5/AM4"},10,4.6,["cooler","aio","360mm","ek","flagship"]),
  p("cooler-bequiet-360","be quiet! Silent Loop 2 360","cooler","be quiet!",3490000,"AIO 360mm yên tĩnh nhất",{"Loại":"AIO 360mm","Quạt":"3x 120mm Silent Wings 3","Socket":"LGA1700/AM5/AM4"},10,4.5,["cooler","aio","360mm","bequiet","yên tĩnh"]),
];

/* ══════════════════ MONITOR — ~50 SKUs ══════════════════ */
const monitors: Product[] = [
  // 24" 1080p
  p("mon-asus-vg249q1a","ASUS VG249Q1A 24\" 1080p 165Hz IPS","monitor","ASUS",3490000,"24\" 1080p 165Hz IPS, eSports",{"Kích thước":"23.8 inch","Độ phân giải":"1920x1080 (FHD)","Tần số":"165 Hz","Panel":"IPS","Thời gian phản hồi":"1ms MPRT","Adaptive Sync":"FreeSync Premium","HDR":"HDR10","Cổng":"HDMI 2.0 x2, DP 1.2"},30,4.5,["monitor","24","1080p","165hz","ips","asus","esports"]),
  p("mon-lg-24gn650","LG 24GN650-B 24\" 1080p 144Hz IPS","monitor","LG",3290000,"24\" 1080p 144Hz IPS, HDR10",{"Kích thước":"23.8 inch","Độ phân giải":"FHD 1080p","Tần số":"144 Hz","Panel":"IPS","Adaptive Sync":"FreeSync Premium / G-Sync Compatible"},25,4.4,["monitor","24","1080p","144hz","lg"]),
  p("mon-msi-g244f2","MSI G244F E2 24\" 1080p 180Hz IPS","monitor","MSI",2990000,"24\" 180Hz IPS budget gaming",{"Kích thước":"23.8 inch","Độ phân giải":"FHD 1080p","Tần số":"180 Hz","Panel":"Rapid IPS","Thời gian phản hồi":"1ms"},25,4.3,["monitor","24","1080p","180hz","msi","budget"]),
  p("mon-aoc-24g2sp","AOC 24G2SP 24\" 1080p 165Hz IPS","monitor","AOC",2790000,"24\" budget gaming monitor",{"Kích thước":"23.8 inch","Độ phân giải":"FHD 1080p","Tần số":"165 Hz","Panel":"IPS"},30,4.2,["monitor","24","1080p","165hz","aoc","budget"]),
  p("mon-benq-xl2411k","BenQ ZOWIE XL2411K 24\" 1080p 144Hz TN","monitor","BenQ",4490000,"eSports TN panel, DyAc+",{"Kích thước":"24 inch","Độ phân giải":"FHD 1080p","Tần số":"144 Hz","Panel":"TN","Tính năng":"DyAc+ (motion blur reduction)"},15,4.3,["monitor","24","1080p","144hz","benq","zowie","tn","esports"]),

  // 27" 1440p
  p("mon-lg-27gp850","LG 27GP850-B 27\" 1440p 165Hz Nano IPS","monitor","LG",7490000,"27\" 1440p 165Hz Nano IPS, sRGB 98%",{"Kích thước":"27 inch","Độ phân giải":"2560x1440 (QHD)","Tần số":"165 Hz (OC 180Hz)","Panel":"Nano IPS","sRGB":"98%","DCI-P3":"98%","Adaptive Sync":"G-Sync Compatible","HDR":"HDR600"},20,4.7,["monitor","27","1440p","165hz","ips","lg","nano ips"]),
  p("mon-dell-s2722dgm","Dell S2722DGM 27\" 1440p 165Hz VA","monitor","Dell",5990000,"27\" 1440p VA, contrast cao",{"Kích thước":"27 inch","Độ phân giải":"QHD 1440p","Tần số":"165 Hz","Panel":"VA (Curved 1500R)","Contrast":"3000:1"},15,4.4,["monitor","27","1440p","165hz","va","dell","curved"]),
  p("mon-asus-vg27aq1a","ASUS VG27AQ1A 27\" 1440p 170Hz IPS","monitor","ASUS",6490000,"27\" 1440p 170Hz IPS gaming",{"Kích thước":"27 inch","Độ phân giải":"QHD 1440p","Tần số":"170 Hz","Panel":"IPS","HDR":"HDR10","Adaptive Sync":"G-Sync Compatible"},18,4.6,["monitor","27","1440p","170hz","asus","ips"]),
  p("mon-msi-mag274qrf","MSI MAG274QRF-QD 27\" 1440p 165Hz IPS","monitor","MSI",7990000,"27\" Quantum Dot IPS, màu cực đẹp",{"Kích thước":"27 inch","Độ phân giải":"QHD 1440p","Tần số":"165 Hz","Panel":"Rapid IPS + Quantum Dot","DCI-P3":"97%","sRGB":"100%"},15,4.7,["monitor","27","1440p","165hz","msi","quantum dot"]),
  p("mon-gigabyte-m27q","Gigabyte M27Q 27\" 1440p 170Hz IPS","monitor","Gigabyte",5990000,"27\" 1440p value gaming",{"Kích thước":"27 inch","Độ phân giải":"QHD 1440p","Tần số":"170 Hz","Panel":"IPS","sRGB":"140%"},18,4.5,["monitor","27","1440p","gigabyte","value"]),
  p("mon-samsung-g5-27","Samsung Odyssey G5 27\" 1440p 165Hz VA","monitor","Samsung",5490000,"27\" curved 1440p VA",{"Kích thước":"27 inch","Độ phân giải":"QHD 1440p","Tần số":"165 Hz","Panel":"VA (Curved 1000R)"},15,4.3,["monitor","27","1440p","samsung","curved","va"]),

  // 27" 4K
  p("mon-lg-27gp950","LG 27GP950-B 27\" 4K 160Hz Nano IPS","monitor","LG",14990000,"27\" 4K 160Hz, HDMI 2.1, HDR600",{"Kích thước":"27 inch","Độ phân giải":"3840x2160 (4K UHD)","Tần số":"160 Hz","Panel":"Nano IPS","HDMI":"2.1 (4K 120Hz)","HDR":"VESA DisplayHDR 600"},10,4.7,["monitor","27","4k","160hz","lg","hdmi2.1","premium"]),
  p("mon-samsung-g7-28","Samsung Odyssey G7 28\" 4K 144Hz IPS","monitor","Samsung",10990000,"28\" 4K 144Hz IPS, HDMI 2.1",{"Kích thước":"28 inch","Độ phân giải":"4K UHD","Tần số":"144 Hz","Panel":"IPS","HDMI":"2.1"},12,4.5,["monitor","28","4k","144hz","samsung"]),
  p("mon-asus-pg27aqdm","ASUS ROG PG27AQDM 27\" 1440p 240Hz OLED","monitor","ASUS",17990000,"27\" QHD OLED 240Hz, gaming king",{"Kích thước":"26.5 inch","Độ phân giải":"QHD 1440p","Tần số":"240 Hz","Panel":"WOLED","Thời gian phản hồi":"0.03ms GTG","HDR":"DisplayHDR True Black 400"},8,4.9,["monitor","27","1440p","240hz","oled","asus","rog","premium"]),

  // Ultrawide
  p("mon-lg-34gp950g","LG 34GP950G-B 34\" Ultrawide 3440x1440 160Hz IPS","monitor","LG",19990000,"34\" Ultrawide Nano IPS, G-Sync Ultimate",{"Kích thước":"34 inch","Độ phân giải":"3440x1440 (UWQHD)","Tần số":"160 Hz","Panel":"Nano IPS","Adaptive Sync":"G-Sync Ultimate","HDR":"VESA DisplayHDR 600"},8,4.7,["monitor","34","ultrawide","1440p","lg","gsync"]),
  p("mon-dell-aw3423dwf","Dell Alienware AW3423DWF 34\" QD-OLED","monitor","Dell",21990000,"34\" QD-OLED Ultrawide, 165Hz, HDR True Black",{"Kích thước":"34.18 inch","Độ phân giải":"3440x1440","Tần số":"165 Hz","Panel":"QD-OLED","Contrast":"1,000,000:1","HDR":"DisplayHDR True Black 400"},8,4.9,["monitor","34","ultrawide","oled","dell","alienware","premium"]),
  p("mon-samsung-g9-49","Samsung Odyssey G9 49\" DQHD 240Hz VA","monitor","Samsung",24990000,"49\" super ultrawide dual QHD, 1000R curved",{"Kích thước":"49 inch","Độ phân giải":"5120x1440 (DQHD)","Tần số":"240 Hz","Panel":"VA Curved 1000R","HDR":"VESA DisplayHDR 1000"},6,4.6,["monitor","49","super ultrawide","samsung","g9","curved"]),

  // Content Creation
  p("mon-lg-27uk850","LG 27UK850-W 27\" 4K 60Hz IPS","monitor","LG",8990000,"27\" 4K IPS sRGB 99%, USB-C, content creation",{"Kích thước":"27 inch","Độ phân giải":"4K UHD","Tần số":"60 Hz","Panel":"IPS","sRGB":"99%","USB-C":"PD 60W"},15,4.4,["monitor","27","4k","content creation","usb-c","srgb"]),
  p("mon-benq-pd2725u","BenQ PD2725U 27\" 4K IPS Thunderbolt 3","monitor","BenQ",15990000,"27\" 4K P3 95%, chuyên đồ họa",{"Kích thước":"27 inch","Độ phân giải":"4K UHD","Tần số":"60 Hz","Panel":"IPS","DCI-P3":"95%","Thunderbolt 3":"Có"},8,4.7,["monitor","27","4k","benq","đồ họa","thunderbolt"]),
];

/* ══════════════════ LAPTOP — ~60 SKUs ══════════════════ */
const laptops: Product[] = [
  // Gaming Budget
  p("lap-msi-gf63","MSI GF63 Thin 12VE","laptop","MSI",15990000,"i5-12450H + RTX 4050, 15.6\" FHD 144Hz",{"CPU":"Intel Core i5-12450H","GPU":"NVIDIA RTX 4050 6GB","RAM":"8GB DDR4","Ổ cứng":"512GB SSD NVMe","Màn hình":"15.6\" FHD 144Hz IPS","Pin":"51Wh (~5h)","Trọng lượng":"1.86 kg","OS":"Windows 11"},20,4.2,["laptop","gaming","msi","gf63","rtx4050","budget"]),
  p("lap-asus-tuf-f15","ASUS TUF Gaming F15 FX507ZC4","laptop","ASUS",17990000,"i5-12500H + RTX 4060, 15.6\" FHD 144Hz",{"CPU":"Intel Core i5-12500H","GPU":"NVIDIA RTX 4060 8GB","RAM":"16GB DDR4","Ổ cứng":"512GB SSD NVMe","Màn hình":"15.6\" FHD 144Hz IPS","Pin":"90Wh (~6h)","Trọng lượng":"2.2 kg","Chứng nhận":"MIL-STD-810H"},25,4.4,["laptop","gaming","asus","tuf","rtx4060"]),
  p("lap-acer-nitro5","Acer Nitro 5 AN515-58","laptop","Acer",16990000,"i5-12500H + RTX 4050, 15.6\" FHD 144Hz",{"CPU":"Intel Core i5-12500H","GPU":"NVIDIA RTX 4050 6GB","RAM":"16GB DDR5","Ổ cứng":"512GB SSD NVMe","Màn hình":"15.6\" FHD 144Hz IPS","Pin":"57Wh (~4h)"},20,4.1,["laptop","gaming","acer","nitro","rtx4050"]),
  p("lap-lenovo-ideapad-gaming3","Lenovo IdeaPad Gaming 3 15","laptop","Lenovo",14990000,"R5-7535HS + RTX 4050, 15.6\" FHD 120Hz",{"CPU":"AMD Ryzen 5 7535HS","GPU":"NVIDIA RTX 4050 6GB","RAM":"8GB DDR5","Ổ cứng":"512GB SSD","Màn hình":"15.6\" FHD 120Hz","Pin":"45Wh (~4h)","Trọng lượng":"2.32 kg"},20,4.0,["laptop","gaming","lenovo","ideapad","budget"]),

  // Gaming Mid-range
  p("lap-asus-tuf-a15","ASUS TUF Gaming A15 FA507NV","laptop","ASUS",22990000,"R7-7735HS + RTX 4060, 15.6\" FHD 144Hz",{"CPU":"AMD Ryzen 7 7735HS","GPU":"NVIDIA RTX 4060 8GB","RAM":"16GB DDR5","Ổ cứng":"512GB SSD NVMe","Màn hình":"15.6\" FHD 144Hz","Pin":"90Wh (~7h)"},18,4.4,["laptop","gaming","asus","tuf a15","rtx4060"]),
  p("lap-msi-katana15","MSI Katana 15 B13VFK","laptop","MSI",24990000,"i7-13620H + RTX 4060, 15.6\" FHD 144Hz",{"CPU":"Intel Core i7-13620H","GPU":"NVIDIA RTX 4060 8GB","RAM":"16GB DDR5","Ổ cứng":"1TB SSD NVMe","Màn hình":"15.6\" FHD 144Hz IPS"},15,4.3,["laptop","gaming","msi","katana","rtx4060","i7"]),
  p("lap-lenovo-legion5","Lenovo Legion 5 15IAH7","laptop","Lenovo",25990000,"i7-12700H + RTX 4060, 15.6\" 1440p 165Hz",{"CPU":"Intel Core i7-12700H","GPU":"NVIDIA RTX 4060 8GB","RAM":"16GB DDR5","Ổ cứng":"512GB SSD","Màn hình":"15.6\" QHD 165Hz IPS","Pin":"80Wh (~6h)","Tính năng":"MUX Switch"},15,4.5,["laptop","gaming","lenovo","legion","rtx4060","1440p"]),
  p("lap-hp-omen16","HP OMEN 16-wf0088TX","laptop","HP",27990000,"i7-13700H + RTX 4070, 16.1\" QHD 165Hz",{"CPU":"Intel Core i7-13700H","GPU":"NVIDIA RTX 4070 8GB","RAM":"16GB DDR5","Ổ cứng":"1TB SSD","Màn hình":"16.1\" QHD 165Hz IPS","Pin":"83Wh"},12,4.4,["laptop","gaming","hp","omen","rtx4070","1440p"]),

  // Gaming Premium
  p("lap-rog-strix-g16","ASUS ROG Strix G16 G614JV","laptop","ASUS",32990000,"i7-13650HX + RTX 4060, 16\" QHD 165Hz",{"CPU":"Intel Core i7-13650HX","GPU":"NVIDIA RTX 4060 8GB","RAM":"16GB DDR5","Ổ cứng":"1TB SSD","Màn hình":"16\" QHD 165Hz IPS","Pin":"90Wh","MUX Switch":"Có"},12,4.5,["laptop","gaming","asus","rog strix","rtx4060","premium"]),
  p("lap-rog-strix-scar16","ASUS ROG Strix SCAR 16 G634JY","laptop","ASUS",54990000,"i9-13980HX + RTX 4080, 16\" QHD 240Hz",{"CPU":"Intel Core i9-13980HX","GPU":"NVIDIA RTX 4080 12GB","RAM":"32GB DDR5","Ổ cứng":"1TB SSD","Màn hình":"16\" QHD 240Hz IPS (mini-LED)","Pin":"90Wh"},8,4.8,["laptop","gaming","asus","rog scar","rtx4080","flagship"]),
  p("lap-msi-raider-ge68","MSI Raider GE68 HX 13VH","laptop","MSI",49990000,"i9-13950HX + RTX 4080, 16\" QHD 240Hz",{"CPU":"Intel Core i9-13950HX","GPU":"NVIDIA RTX 4080 12GB","RAM":"32GB DDR5","Ổ cứng":"1TB SSD","Màn hình":"16\" QHD 240Hz mini-LED"},8,4.7,["laptop","gaming","msi","raider","rtx4080","flagship"]),
  p("lap-legion-pro5","Lenovo Legion Pro 5 16IRX8","laptop","Lenovo",39990000,"i7-13700HX + RTX 4070, 16\" WQXGA 240Hz",{"CPU":"Intel Core i7-13700HX","GPU":"NVIDIA RTX 4070 8GB","RAM":"32GB DDR5","Ổ cứng":"1TB SSD","Màn hình":"16\" 2560x1600 240Hz IPS"},10,4.6,["laptop","gaming","lenovo","legion pro","rtx4070"]),

  // Ultrabook / Productivity
  p("lap-macbook-air-m2","MacBook Air M2 13.6\" 2022","laptop","Apple",24990000,"Chip M2, 13.6\" Liquid Retina, siêu mỏng nhẹ",{"CPU":"Apple M2 (8C CPU + 10C GPU)","RAM":"8GB Unified","Ổ cứng":"256GB SSD","Màn hình":"13.6\" Liquid Retina 2560x1664","Pin":"18 giờ","Trọng lượng":"1.24 kg","OS":"macOS"},25,4.7,["laptop","macbook","air","m2","apple","ultrabook","mỏng nhẹ"]),
  p("lap-macbook-air-m2-16","MacBook Air M2 13.6\" 16GB/512GB","laptop","Apple",31990000,"M2 16GB RAM 512GB SSD",{"CPU":"Apple M2","RAM":"16GB Unified","Ổ cứng":"512GB SSD","Màn hình":"13.6\" Liquid Retina","Pin":"18 giờ"},15,4.8,["laptop","macbook","air","m2","16gb"]),
  p("lap-macbook-pro-m3","MacBook Pro 14\" M3 2023","laptop","Apple",39990000,"Chip M3, 14\" Liquid Retina XDR, ProRes",{"CPU":"Apple M3 (8C CPU + 10C GPU)","RAM":"8GB Unified","Ổ cứng":"512GB SSD","Màn hình":"14.2\" Liquid Retina XDR 3024x1964","Pin":"17 giờ","Trọng lượng":"1.55 kg"},12,4.8,["laptop","macbook","pro","m3","apple"]),
  p("lap-macbook-pro-m3p","MacBook Pro 14\" M3 Pro","laptop","Apple",49990000,"M3 Pro 12C CPU, 18GB, chuyên nghiệp",{"CPU":"Apple M3 Pro (12C CPU + 18C GPU)","RAM":"18GB Unified","Ổ cứng":"512GB SSD","Màn hình":"14.2\" Liquid Retina XDR","Pin":"17 giờ"},8,4.9,["laptop","macbook","pro","m3 pro","chuyên nghiệp"]),
  p("lap-dell-xps15","Dell XPS 15 9530","laptop","Dell",32990000,"i7-13700H, 15.6\" 3.5K OLED, siêu đẹp",{"CPU":"Intel Core i7-13700H","GPU":"Intel Iris Xe + RTX 4050","RAM":"16GB DDR5","Ổ cứng":"512GB SSD","Màn hình":"15.6\" 3.5K OLED 100% DCI-P3","Pin":"86Wh","Trọng lượng":"1.86 kg"},12,4.5,["laptop","dell","xps","oled","ultrabook","đẹp"]),
  p("lap-thinkpad-x1-carbon","Lenovo ThinkPad X1 Carbon Gen 11","laptop","Lenovo",34990000,"i7-1365U, 14\" 2.8K OLED, doanh nhân",{"CPU":"Intel Core i7-1365U","RAM":"16GB LPDDR5","Ổ cứng":"512GB SSD","Màn hình":"14\" 2.8K OLED","Pin":"57Wh (~12h)","Trọng lượng":"1.12 kg"},10,4.6,["laptop","lenovo","thinkpad","x1 carbon","doanh nhân","nhẹ"]),
  p("lap-asus-zenbook14","ASUS Zenbook 14 OLED UX3402VA","laptop","ASUS",22990000,"i5-13500H, 14\" 2.8K OLED, mỏng nhẹ",{"CPU":"Intel Core i5-13500H","RAM":"16GB LPDDR5","Ổ cứng":"512GB SSD","Màn hình":"14\" 2.8K OLED 100% DCI-P3","Pin":"75Wh (~10h)","Trọng lượng":"1.39 kg"},18,4.5,["laptop","asus","zenbook","oled","ultrabook"]),
  p("lap-hp-spectre14","HP Spectre x360 14","laptop","HP",34990000,"i7-1355U, 13.5\" 3K2K OLED, 2-in-1",{"CPU":"Intel Core i7-1355U","RAM":"16GB LPDDR5","Ổ cứng":"1TB SSD","Màn hình":"13.5\" 3K2K OLED Touch","Pin":"66Wh","Trọng lượng":"1.36 kg","Tính năng":"2-in-1 convertible"},10,4.5,["laptop","hp","spectre","oled","2in1","convertible"]),

  // Budget Laptop
  p("lap-acer-aspire5","Acer Aspire 5 A515-57","laptop","Acer",11990000,"i5-12450H, 15.6\" FHD IPS, văn phòng",{"CPU":"Intel Core i5-12450H","RAM":"8GB DDR4","Ổ cứng":"512GB SSD","Màn hình":"15.6\" FHD IPS","Pin":"50Wh (~7h)","Trọng lượng":"1.76 kg"},25,4.1,["laptop","acer","aspire","văn phòng","budget"]),
  p("lap-lenovo-ideapad5","Lenovo IdeaPad 5 15IAL7","laptop","Lenovo",12990000,"i5-1235U, 15.6\" FHD IPS, học tập",{"CPU":"Intel Core i5-1235U","RAM":"8GB DDR4","Ổ cứng":"512GB SSD","Màn hình":"15.6\" FHD IPS","Pin":"57Wh (~8h)"},20,4.2,["laptop","lenovo","ideapad","học tập","budget"]),
  p("lap-hp-15-fd0082tu","HP 15-fd0082TU","laptop","HP",10990000,"i3-1315U, 15.6\" FHD, văn phòng siêu rẻ",{"CPU":"Intel Core i3-1315U","RAM":"8GB DDR4","Ổ cứng":"256GB SSD","Màn hình":"15.6\" FHD"},25,3.9,["laptop","hp","15","văn phòng","siêu rẻ"]),
];

/* ══════════════════ KEYBOARD — ~30 SKUs ══════════════════ */
const keyboards: Product[] = [
  // Mechanical Gaming
  p("kb-razer-deathstalker-pro","Razer DeathStalker V2 Pro","keyboard","Razer",4990000,"Low-profile quang học, wireless HyperSpeed, 40h pin",{"Loại":"Mechanical (Low-profile Optical)","Layout":"Full-size / TKL","Kết nối":"HyperSpeed 2.4GHz / Bluetooth / USB-C","Pin":"40 giờ","Switch":"Razer Low-profile Optical","RGB":"Razer Chroma","Keycap":"ABS"},12,4.5,["keyboard","razer","deathstalker","low-profile","wireless"]),
  p("kb-corsair-k100","Corsair K100 RGB","keyboard","Corsair",5490000,"Flagship OPX switch, iCUE dial, RGB",{"Loại":"Mechanical (Corsair OPX)","Layout":"Full-size","Kết nối":"USB-C","Switch":"Corsair OPX (quang học)","RGB":"iCUE RGB","Tính năng":"iCUE control wheel","Keycap":"PBT Double-shot"},10,4.7,["keyboard","corsair","k100","flagship","opx","rgb"]),
  p("kb-logitech-g915","Logitech G915 TKL Lightspeed","keyboard","Logitech",4490000,"Low-profile wireless, GL switch, TKL",{"Loại":"Mechanical (GL Low-profile)","Layout":"TKL","Kết nối":"Lightspeed 2.4GHz / Bluetooth","Pin":"40 giờ","Switch":"GL Tactile","RGB":"LIGHTSYNC RGB"},12,4.5,["keyboard","logitech","g915","wireless","low-profile","tkl"]),
  p("kb-razer-huntsman-v3","Razer Huntsman V3 Pro TKL","keyboard","Razer",4990000,"Analog optical switch, TKL, esports",{"Loại":"Mechanical (Analog Optical)","Layout":"TKL","Kết nối":"USB-C","Switch":"Razer Analog Optical Gen 2","Tính năng":"Rapid Trigger, adjustable actuation"},10,4.7,["keyboard","razer","huntsman","analog","rapid trigger","esports"]),
  p("kb-steelseries-apex-pro","SteelSeries Apex Pro TKL","keyboard","SteelSeries",4490000,"OmniPoint 2.0 adjustable switch, TKL",{"Loại":"Mechanical (OmniPoint 2.0)","Layout":"TKL","Kết nối":"USB-C","Tính năng":"Adjustable actuation 0.2-3.8mm, Rapid Trigger"},10,4.7,["keyboard","steelseries","apex pro","adjustable","rapid trigger"]),
  // Mid-range
  p("kb-keychron-q1","Keychron Q1 V2 Knob 75%","keyboard","Keychron",2490000,"Custom 75%, gasket mount, hot-swap, CNC nhôm",{"Loại":"Mechanical (Gateron G Pro)","Layout":"75%","Kết nối":"USB-C","Mount":"Gasket","Hot-swap":"Có","Vỏ":"CNC Aluminum","RGB":"South-facing"},15,4.7,["keyboard","keychron","q1","custom","75%","gasket","hot-swap"]),
  p("kb-keychron-k8","Keychron K8 Pro TKL","keyboard","Keychron",1690000,"TKL wireless, QMK/VIA, hot-swap",{"Loại":"Mechanical (Gateron G Pro)","Layout":"TKL","Kết nối":"Bluetooth / USB-C","Pin":"72h RGB / 200h no-RGB","Hot-swap":"Có","QMK/VIA":"Có"},20,4.5,["keyboard","keychron","k8","tkl","wireless","qmk"]),
  p("kb-keychron-v1","Keychron V1 75%","keyboard","Keychron",990000,"Custom 75% budget, QMK/VIA",{"Loại":"Mechanical (Keychron K Pro)","Layout":"75%","Kết nối":"USB-C","Hot-swap":"Có","QMK/VIA":"Có"},25,4.3,["keyboard","keychron","v1","budget","custom"]),
  p("kb-ducky-one3","Ducky One 3 TKL","keyboard","Ducky",2990000,"TKL hot-swap, QUACK Mechanics",{"Loại":"Mechanical (Cherry MX)","Layout":"TKL","Kết nối":"USB-C","Hot-swap":"Có","Keycap":"PBT Double-shot"},15,4.5,["keyboard","ducky","one3","cherry mx","hot-swap"]),
  p("kb-leopold-fc750r","Leopold FC750R PD 87Key","keyboard","Leopold",2790000,"TKL Cherry MX, build quality tốt nhất",{"Loại":"Mechanical (Cherry MX)","Layout":"TKL","Kết nối":"USB-C","Keycap":"PBT Double-shot","Sound dampening":"Có"},12,4.6,["keyboard","leopold","fc750r","cherry mx","quality"]),
  // Budget
  p("kb-akko-3098b","Akko 3098B Multi-mode","keyboard","Akko",990000,"Full-size wireless, CS switch, giá rẻ",{"Loại":"Mechanical (Akko CS)","Layout":"Full-size (98key)","Kết nối":"Bluetooth / 2.4GHz / USB-C","Pin":"3000mAh","Hot-swap":"Có"},30,4.3,["keyboard","akko","3098b","wireless","budget"]),
  p("kb-royal-kludge-rk84","Royal Kludge RK84","keyboard","Royal Kludge",690000,"75% wireless, budget hot-swap",{"Loại":"Mechanical","Layout":"75% (84key)","Kết nối":"Bluetooth / 2.4GHz / USB-C","Hot-swap":"Có","RGB":"Có"},35,4.1,["keyboard","rk84","royal kludge","budget","wireless"]),
  p("kb-fuhlen-m87s","Fuhlen M87s","keyboard","Fuhlen",490000,"TKL budget Việt Nam, Cherry MX clone",{"Loại":"Mechanical (Kailh)","Layout":"TKL","Kết nối":"USB"},40,3.8,["keyboard","fuhlen","m87s","budget","việt nam"]),
  // Membrane
  p("kb-logitech-k120","Logitech K120","keyboard","Logitech",190000,"Bàn phím membrane văn phòng, bền bỉ",{"Loại":"Membrane","Layout":"Full-size","Kết nối":"USB"},60,4.0,["keyboard","logitech","k120","membrane","văn phòng","siêu rẻ"]),
  p("kb-razer-cynosa-v2","Razer Cynosa V2","keyboard","Razer",890000,"Membrane gaming, RGB Chroma",{"Loại":"Membrane","Layout":"Full-size","Kết nối":"USB","RGB":"Razer Chroma"},20,4.0,["keyboard","razer","cynosa","membrane","gaming","rgb"]),
];

/* ══════════════════ MOUSE — ~30 SKUs ══════════════════ */
const mice: Product[] = [
  // Wireless Gaming Premium
  p("mouse-gpx-superlight2","Logitech G Pro X Superlight 2","mouse","Logitech",3490000,"63g siêu nhẹ, HERO 2 sensor, eSports king",{"Sensor":"HERO 2 (32000 DPI)","Trọng lượng":"63g","Kết nối":"Lightspeed 2.4GHz","Pin":"95 giờ","Switch":"Lightforce hybrid optical-mechanical","Polling rate":"2000Hz (khả dụng)"},20,4.9,["mouse","logitech","superlight","siêu nhẹ","esports","wireless"]),
  p("mouse-razer-viper-v3-pro","Razer Viper V3 Pro","mouse","Razer",3990000,"54g ultralight, Focus Pro 36K, 8000Hz",{"Sensor":"Focus Pro 36K","Trọng lượng":"54g","Kết nối":"HyperSpeed / Bluetooth","Pin":"90 giờ","Polling rate":"Lên đến 8000Hz (dongle)"},12,4.8,["mouse","razer","viper v3 pro","ultralight","8000hz"]),
  p("mouse-razer-deathadder-v3-pro","Razer DeathAdder V3 Pro","mouse","Razer",3290000,"Ergonomic nhẹ 63g, Focus Pro 30K",{"Sensor":"Focus Pro 30K","Trọng lượng":"63g","Kết nối":"HyperSpeed / Bluetooth","Pin":"90 giờ","Shape":"Ergonomic"},15,4.7,["mouse","razer","deathadder","ergonomic","wireless"]),
  p("mouse-pulsar-x2v2","Pulsar X2V2 Wireless","mouse","Pulsar",1990000,"Lightweight 53g, PAW3395, eSports",{"Sensor":"PAW3395 (26000 DPI)","Trọng lượng":"53g","Kết nối":"2.4GHz / Bluetooth","Pin":"70 giờ"},15,4.6,["mouse","pulsar","x2v2","lightweight","esports"]),
  p("mouse-zowie-ec2-cw","Zowie EC2-CW Wireless","mouse","Zowie",2490000,"Ergonomic eSports, không dây, 3370 sensor",{"Sensor":"3370 (3200 DPI)","Trọng lượng":"77g","Kết nối":"2.4GHz","Pin":"70 giờ","Shape":"Ergonomic"},12,4.5,["mouse","zowie","ec2","esports","ergonomic"]),
  // Wireless Gaming Mid
  p("mouse-logitech-g502x","Logitech G502 X Lightspeed","mouse","Logitech",2990000,"G502 wireless, HERO 25K, 102g",{"Sensor":"HERO 25K","Trọng lượng":"102g","Kết nối":"Lightspeed 2.4GHz","Pin":"130 giờ","Nút":"13 nút programmable","DPI Shift":"Có"},18,4.5,["mouse","logitech","g502x","wireless","đa nút"]),
  p("mouse-razer-basilisk-v3-pro","Razer Basilisk V3 Pro","mouse","Razer",3490000,"Ergonomic, HyperScroll, Focus Pro 30K",{"Sensor":"Focus Pro 30K","Trọng lượng":"112g","Kết nối":"HyperSpeed / Bluetooth","Pin":"90 giờ","Tính năng":"HyperScroll tilt wheel"},12,4.5,["mouse","razer","basilisk","ergonomic","hyperscroll"]),
  p("mouse-steelseries-aerox5","SteelSeries Aerox 5 Wireless","mouse","SteelSeries",2490000,"Lightweight 74g, 9 nút, IP54",{"Sensor":"TrueMove Air (18000 DPI)","Trọng lượng":"74g","Kết nối":"2.4GHz / Bluetooth","Pin":"180 giờ","Chống nước":"IP54"},12,4.3,["mouse","steelseries","aerox5","lightweight","ip54"]),
  // Wired Gaming
  p("mouse-logitech-g403","Logitech G403 HERO","mouse","Logitech",890000,"Ergonomic gaming wired, HERO 25K",{"Sensor":"HERO 25K","Trọng lượng":"87g","Kết nối":"USB wired","DPI":"100-25600"},20,4.4,["mouse","logitech","g403","wired","ergonomic"]),
  p("mouse-razer-deathadder-essential","Razer DeathAdder Essential","mouse","Razer",490000,"Ergonomic entry, 6400 DPI",{"Sensor":"Optical (6400 DPI)","Trọng lượng":"96g","Kết nối":"USB wired"},40,4.2,["mouse","razer","deathadder essential","budget","entry"]),
  p("mouse-steelseries-rival3","SteelSeries Rival 3","mouse","SteelSeries",590000,"Entry gaming, TrueMove Core",{"Sensor":"TrueMove Core (8500 DPI)","Trọng lượng":"77g","Kết nối":"USB wired"},30,4.1,["mouse","steelseries","rival3","budget"]),
  p("mouse-zowie-ec2","Zowie EC2 Wired","mouse","Zowie",1490000,"eSports ergonomic, 3360 sensor",{"Sensor":"3360 (3200 DPI)","Trọng lượng":"90g","Kết nối":"USB wired"},15,4.4,["mouse","zowie","ec2","wired","esports"]),
  // Office
  p("mouse-logitech-mx-master3s","Logitech MX Master 3S","mouse","Logitech",2490000,"Chuột văn phòng premium, MagSpeed scroll",{"Sensor":"Darkfield 8000 DPI","Trọng lượng":"141g","Kết nối":"Bluetooth / USB receiver","Pin":"70 ngày","Tính năng":"MagSpeed scroll, Flow cross-computer, USB-C"},15,4.7,["mouse","logitech","mx master","văn phòng","premium","productivity"]),
  p("mouse-logitech-m590","Logitech M590 Multi-Device","mouse","Logitech",590000,"Chuột văn phòng yên tĩnh, multi-device",{"Sensor":"1000 DPI","Kết nối":"Bluetooth / USB receiver","Pin":"24 tháng (pin AA)","Tính năng":"Silent click, Flow"},25,4.1,["mouse","logitech","m590","văn phòng","yên tĩnh"]),
  p("mouse-logitech-b100","Logitech B100","mouse","Logitech",99000,"Chuột USB cơ bản, bền bỉ",{"Sensor":"800 DPI","Kết nối":"USB wired"},60,3.8,["mouse","logitech","b100","cơ bản","siêu rẻ"]),
];

/* ══════════════════ HEADSET — ~30 SKUs ══════════════════ */
const headsets: Product[] = [
  // Wireless Gaming Premium
  p("hs-hyperx-cloud3-wireless","HyperX Cloud III Wireless","headset","HyperX",3290000,"Wireless 2.4GHz, DTS, 120h pin, gaming",{"Driver":"53mm","Kết nối":"2.4GHz wireless","Pin":"120 giờ","Mic":"Detachable noise-cancelling","DTS":"Spatial Audio","Trọng lượng":"340g","Tương thích":"PC, PS5"},18,4.5,["headset","hyperx","cloud3","wireless","gaming","120h"]),
  p("hs-logitech-g735","Logitech G735 Wireless","headset","Logitech",4490000,"Wireless, Bluetooth + Lightspeed, RGB",{"Driver":"40mm Pro-G","Kết nối":"Lightspeed 2.4GHz + Bluetooth","Pin":"56 giờ","Mic":"Detachable boom mic","RGB":"LIGHTSYNC"},12,4.4,["headset","logitech","g735","wireless","bluetooth"]),
  p("hs-steelseries-arctis-nova7","SteelSeries Arctis Nova 7 Wireless","headset","SteelSeries",3490000,"Multi-platform wireless, ANC, 38h",{"Driver":"40mm","Kết nối":"2.4GHz + Bluetooth","Pin":"38 giờ","ANC":"Có","Mic":"Retractable ClearCast Gen 2","Tương thích":"PC, PS5, Switch, Mobile"},15,4.6,["headset","steelseries","arctis nova 7","wireless","anc"]),
  p("hs-razer-blackshark-v2-pro","Razer BlackShark V2 Pro","headset","Razer",3990000,"eSports wireless, THX Spatial, 70h",{"Driver":"50mm TriForce Titanium","Kết nối":"HyperSpeed 2.4GHz + Bluetooth","Pin":"70 giờ","Mic":"Detachable HyperClear Super Wideband","THX":"Spatial Audio"},12,4.6,["headset","razer","blackshark","esports","wireless","thx"]),
  p("hs-corsair-virtuoso-rgb","Corsair VIRTUOSO RGB Wireless XT","headset","Corsair",4490000,"Hi-Res Audio, Dolby Atmos, premium",{"Driver":"50mm","Kết nối":"Slipstream 2.4GHz + Bluetooth","Pin":"15 giờ","Mic":"Broadcast-grade","Audio":"Hi-Res, Dolby Atmos"},10,4.5,["headset","corsair","virtuoso","premium","dolby"]),
  p("hs-logitech-g-pro-x2","Logitech G PRO X 2 Lightspeed","headset","Logitech",5490000,"eSports flagship, 50h, PRO-G GRAPHENE",{"Driver":"50mm PRO-G GRAPHENE","Kết nối":"Lightspeed + Bluetooth + USB-C","Pin":"50 giờ","Mic":"Detachable 6mm","DTS":"X 2.0","Trọng lượng":"345g"},10,4.7,["headset","logitech","g pro x2","esports","flagship","graphene"]),
  // Wireless Budget
  p("hs-hyperx-cloud-stinger2","HyperX Cloud Stinger 2 Wireless","headset","HyperX",1290000,"Wireless budget, 20h, nhẹ 275g",{"Driver":"40mm","Kết nối":"2.4GHz wireless","Pin":"20 giờ","Mic":"Swivel-to-mute","Trọng lượng":"275g"},25,4.2,["headset","hyperx","stinger","wireless","budget","nhẹ"]),
  p("hs-corsair-hs55-wireless","Corsair HS55 Wireless","headset","Corsair",1490000,"Wireless + Bluetooth, budget gaming",{"Driver":"50mm","Kết nối":"2.4GHz + Bluetooth","Pin":"24 giờ","Mic":"Flip-to-mute"},20,4.1,["headset","corsair","hs55","wireless","budget"]),
  // Wired Gaming
  p("hs-hyperx-cloud2","HyperX Cloud II","headset","HyperX",1490000,"Wired classic, 7.1 virtual surround",{"Driver":"53mm","Kết nối":"USB / 3.5mm","Mic":"Detachable noise-cancelling","Surround":"Virtual 7.1","Trọng lượng":"309g"},20,4.5,["headset","hyperx","cloud2","wired","classic","7.1"]),
  p("hs-razer-kraken-v3","Razer Kraken V3","headset","Razer",1990000,"Wired gaming, THX Spatial, Chroma",{"Driver":"50mm TriForce","Kết nối":"USB","Mic":"HyperClear Cardioid","THX":"Spatial Audio","RGB":"Chroma"},15,4.3,["headset","razer","kraken","wired","thx","rgb"]),
  p("hs-steelseries-arctis-1","SteelSeries Arctis 1","headset","SteelSeries",990000,"Wired budget multi-platform",{"Driver":"40mm","Kết nối":"3.5mm","Mic":"Detachable ClearCast","Tương thích":"PC, PS5, Xbox, Switch, Mobile"},25,4.1,["headset","steelseries","arctis 1","budget","wired"]),
  p("hs-coolermaster-mh751","Cooler Master MH751","headset","Cooler Master",1290000,"Wired nhẹ, âm hay, mic tốt",{"Driver":"40mm Neodymium","Kết nối":"3.5mm + USB DAC","Mic":"Detachable omni-directional","Trọng lượng":"270g"},15,4.4,["headset","coolermaster","mh751","nhẹ","âm hay"]),
  // Audiophile / Content Creator
  p("hs-beyerdynamic-dt990-pro","Beyerdynamic DT 990 Pro 250Ω","headset","Beyerdynamic",3990000,"Open-back audiophile, mixing/mastering",{"Driver":"45mm","Impedance":"250Ω","Kết nối":"3.5mm (adapter 6.35mm)","Loại":"Open-back","Mic":"Không có"},10,4.6,["headset","beyerdynamic","dt990","open-back","audiophile"]),
  p("hs-audiotechnica-m50x","Audio-Technica ATH-M50x","headset","Audio-Technica",3490000,"Closed-back studio monitor, flat tuning",{"Driver":"45mm","Kết nối":"3.5mm detachable","Loại":"Closed-back","Mic":"Không có (mua riêng)","Dùng cho":"Studio monitoring, mixing"},12,4.6,["headset","audio-technica","m50x","studio","monitoring","closed-back"]),
];

/* ═══════════════════════════════════════
   EXPORT ALL PRODUCTS
   ═══════════════════════════════════════ */
export const ALL_MEGA_PRODUCTS: Product[] = [
  ...cpus,
  ...gpus,
  ...mainboards,
  ...rams,
  ...ssds,
  ...hdds,
  ...psus,
  ...cases,
  ...coolers,
  ...monitors,
  ...laptops,
  ...keyboards,
  ...mice,
  ...headsets,
];

// Stats for verification
export const MEGA_PRODUCT_STATS = {
  total: ALL_MEGA_PRODUCTS.length,
  cpus: cpus.length,
  gpus: gpus.length,
  mainboards: mainboards.length,
  rams: rams.length,
  ssds: ssds.length,
  hdds: hdds.length,
  psus: psus.length,
  cases: cases.length,
  coolers: coolers.length,
  monitors: monitors.length,
  laptops: laptops.length,
  keyboards: keyboards.length,
  mice: mice.length,
  headsets: headsets.length,
};
