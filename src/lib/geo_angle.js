export default function (lng1, lat1, lng2, lat2, lng3, lat3) {
    const lnglat1_2 = Math.sqrt(Math.pow(lng1 - lng2, 2) + Math.pow(lat1 - lat2, 2));
    const lnglat1_3 = Math.sqrt(Math.pow(lng1 - lng3, 2) + Math.pow(lat1 - lat3, 2));
    const lnglat2_3 = Math.sqrt(Math.pow(lng2 - lng3, 2) + Math.pow(lat2 - lat3, 2));
    if (lnglat1_2 === 0 || lnglat1_3 === 0 || lnglat2_3 === 0) return 0;
    const cosR = (Math.pow(lnglat1_2, 2) + Math.pow(lnglat1_3, 2) - Math.pow(lnglat2_3, 2)) / (2 * lnglat1_2 * lnglat1_3);
    // 返回弧度角
    return Math.acos(cosR);
}