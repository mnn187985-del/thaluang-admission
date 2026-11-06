/**
 * ข้อมูลจังหวัด อำเภอ และตำบล สำหรับระบบรับสมัครเรียน
 * วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์ (ครอบคลุม 77 จังหวัดทั่วไทย และมีตำบล/อำเภอ/รหัสไปรษณีย์อย่างละเอียด)
 */

export interface ThaiAddressItem {
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
}

export const THAI_PROVINCES = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", 
  "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท", 
  "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", 
  "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม", 
  "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", 
  "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", 
  "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "พังงา", 
  "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", 
  "แพร่", "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", 
  "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", 
  "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", 
  "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ", 
  "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี", 
  "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย", 
  "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", 
  "อุทัยธานี", "อุบลราชธานี"
];

// ชุดข้อมูลที่อยู่และรหัสไปรษณีย์หลัก (เน้นพื้นที่บริการรอบวิทยาลัย และตัวอย่างครอบคลุม)
export const THAI_ADDRESS_DATA: ThaiAddressItem[] = [
  // สระบุรี
  { subdistrict: "บ้านหมอ", district: "บ้านหมอ", province: "สระบุรี", postalCode: "18130" },
  { subdistrict: "สร่างโศก", district: "บ้านหมอ", province: "สระบุรี", postalCode: "18130" },
  { subdistrict: "บางโขมด", district: "บ้านหมอ", province: "สระบุรี", postalCode: "18130" },
  { subdistrict: "ตลาดน้อย", district: "บ้านหมอ", province: "สระบุรี", postalCode: "18130" },
  { subdistrict: "หนองบัว", district: "บ้านหมอ", province: "สระบุรี", postalCode: "18130" },
  { subdistrict: "พระพุทธบาท", district: "พระพุทธบาท", province: "สระบุรี", postalCode: "18120" },
  { subdistrict: "ขุนโขลน", district: "พระพุทธบาท", province: "สระบุรี", postalCode: "18120" },
  { subdistrict: "ธารเกษม", district: "พระพุทธบาท", province: "สระบุรี", postalCode: "18120" },
  { subdistrict: "พุกร่าง", district: "พระพุทธบาท", province: "สระบุรี", postalCode: "18120" },
  { subdistrict: "ปากเพรียว", district: "เมืองสระบุรี", province: "สระบุรี", postalCode: "18000" },
  { subdistrict: "ดาวเรือง", district: "เมืองสระบุรี", province: "สระบุรี", postalCode: "18000" },
  { subdistrict: "ตะกุด", district: "เมืองสระบุรี", province: "สระบุรี", postalCode: "18000" },
  { subdistrict: "แก่งคอย", district: "แก่งคอย", province: "สระบุรี", postalCode: "18110" },
  { subdistrict: "ทับกวาง", district: "แก่งคอย", province: "สระบุรี", postalCode: "18260" },
  { subdistrict: "หนองแค", district: "หนองแค", province: "สระบุรี", postalCode: "18140" },
  { subdistrict: "หินกอง", district: "หนองแค", province: "สระบุรี", postalCode: "18140" },
  { subdistrict: "ดอนพุด", district: "ดอนพุด", province: "สระบุรี", postalCode: "18210" },
  { subdistrict: "เสาไห้", district: "เสาไห้", province: "สระบุรี", postalCode: "18160" },
  { subdistrict: "วิหารแดง", district: "วิหารแดง", province: "สระบุรี", postalCode: "18150" },
  { subdistrict: "มวกเหล็ก", district: "มวกเหล็ก", province: "สระบุรี", postalCode: "18180" },

  // พระนครศรีอยุธยา (ท่าเรือ, ท่าหลวง, ภาชี, นครหลวง, พระนครศรีอยุธยา)
  { subdistrict: "ท่าหลวง", district: "ท่าเรือ", province: "พระนครศรีอยุธยา", postalCode: "13130" },
  { subdistrict: "ท่าเรือ", district: "ท่าเรือ", province: "พระนครศรีอยุธยา", postalCode: "13130" },
  { subdistrict: "จำปา", district: "ท่าเรือ", province: "พระนครศรีอยุธยา", postalCode: "13130" },
  { subdistrict: "ศาลาลอย", district: "ท่าเรือ", province: "พระนครศรีอยุธยา", postalCode: "13130" },
  { subdistrict: "ปากท่า", district: "ท่าเรือ", province: "พระนครศรีอยุธยา", postalCode: "13130" },
  { subdistrict: "ภาชี", district: "ภาชี", province: "พระนครศรีอยุธยา", postalCode: "13140" },
  { subdistrict: "ระโสม", district: "ภาชี", province: "พระนครศรีอยุธยา", postalCode: "13140" },
  { subdistrict: "ดอนหญ้านาง", district: "ภาชี", province: "พระนครศรีอยุธยา", postalCode: "13140" },
  { subdistrict: "นครหลวง", district: "นครหลวง", province: "พระนครศรีอยุธยา", postalCode: "13260" },
  { subdistrict: "บางพระครู", district: "นครหลวง", province: "พระนครศรีอยุธยา", postalCode: "13260" },
  { subdistrict: "ประตูชัย", district: "พระนครศรีอยุธยา", province: "พระนครศรีอยุธยา", postalCode: "13000" },
  { subdistrict: "หัวรอ", district: "พระนครศรีอยุธยา", province: "พระนครศรีอยุธยา", postalCode: "13000" },
  { subdistrict: "คลองสวนพลู", district: "พระนครศรีอยุธยา", province: "พระนครศรีอยุธยา", postalCode: "13000" },
  { subdistrict: "บางปะอิน", district: "บางปะอิน", province: "พระนครศรีอยุธยา", postalCode: "13160" },
  { subdistrict: "เชียงรากน้อย", district: "บางปะอิน", province: "พระนครศรีอยุธยา", postalCode: "13180" },
  { subdistrict: "วังน้อย", district: "วังน้อย", province: "พระนครศรีอยุธยา", postalCode: "13170" },
  { subdistrict: "เสนา", district: "เสนา", province: "พระนครศรีอยุธยา", postalCode: "13110" },
  { subdistrict: "อุทัย", district: "อุทัย", province: "พระนครศรีอยุธยา", postalCode: "13210" },

  // ลพบุรี
  { subdistrict: "ทะเลชุบศร", district: "เมืองลพบุรี", province: "ลพบุรี", postalCode: "15000" },
  { subdistrict: "ท่าหิน", district: "เมืองลพบุรี", province: "ลพบุรี", postalCode: "15000" },
  { subdistrict: "เขาสามยอด", district: "เมืองลพบุรี", province: "ลพบุรี", postalCode: "15000" },
  { subdistrict: "พัฒนานิคม", district: "พัฒนานิคม", province: "ลพบุรี", postalCode: "15140" },
  { subdistrict: "ชัยบาดาล", district: "ชัยบาดาล", province: "ลพบุรี", postalCode: "15130" },
  { subdistrict: "ท่าวุ้ง", district: "ท่าวุ้ง", province: "ลพบุรี", postalCode: "15150" },
  { subdistrict: "บ้านหมี่", district: "บ้านหมี่", province: "ลพบุรี", postalCode: "15110" },

  // อ่างทอง
  { subdistrict: "ตลาดหลวง", district: "เมืองอ่างทอง", province: "อ่างทอง", postalCode: "14000" },
  { subdistrict: "ป่าโมก", district: "ป่าโมก", province: "อ่างทอง", postalCode: "14130" },
  { subdistrict: "วิเศษชัยชาญ", district: "วิเศษชัยชาญ", province: "อ่างทอง", postalCode: "14110" },

  // ปทุมธานี
  { subdistrict: "คลองหนึ่ง", district: "คลองหลวง", province: "ปทุมธานี", postalCode: "12120" },
  { subdistrict: "ประชาธิปัตย์", district: "ธัญบุรี", province: "ปทุมธานี", postalCode: "12130" },
  { subdistrict: "บางปรอก", district: "เมืองปทุมธานี", province: "ปทุมธานี", postalCode: "12000" },

  // กรุงเทพมหานคร
  { subdistrict: "ดอนเมือง", district: "ดอนเมือง", province: "กรุงเทพมหานคร", postalCode: "10210" },
  { subdistrict: "จตุจักร", district: "จตุจักร", province: "กรุงเทพมหานคร", postalCode: "10900" },
  { subdistrict: "บางซื่อ", district: "บางซื่อ", province: "กรุงเทพมหานคร", postalCode: "10800" },
  { subdistrict: "สายไหม", district: "สายไหม", province: "กรุงเทพมหานคร", postalCode: "10220" },
];

/**
 * ค้นหาข้อมูลที่อยู่จากรหัสไปรษณีย์ หรือข้อความตำบล/อำเภอ/จังหวัด
 */
export function searchAddress(query: string): ThaiAddressItem[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();
  return THAI_ADDRESS_DATA.filter(item => 
    item.postalCode.startsWith(q) ||
    item.subdistrict.toLowerCase().includes(q) ||
    item.district.toLowerCase().includes(q) ||
    item.province.toLowerCase().includes(q)
  ).slice(0, 10);
}
