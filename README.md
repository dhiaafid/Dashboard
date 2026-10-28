# Dashboard Tanya Jawab Manpower

File yang dibuka atasan: **`dashboard-tanya-jawab-v3.html`**. Satu file, dapat dibuka tanpa internet (Chart.js, huruf Poppins, dan peta sudah tertanam).

`sketsa-dashboard.html` adalah sketsa v2 sebagai acuan dan tidak diubah.

## Susunan

| Bagian | Isi |
|---|---|
| `src/dashboard.src.html` | Tampilan dan logika dashboard |
| `src/data-contoh.json` | Objek `DATA`: seluruh angka contoh |
| `src/peta.json` | Garis peta Jawa Tengah dan DIY (Natural Earth, domain publik) |
| `vendor/` | Chart.js 4.4.1 dan huruf Poppins (lisensi terlampir) |
| `tools/build.js` | Menyusun file HTML akhir: `node tools/build.js` |
| `tools/gen-data.js` | Membuat ulang data contoh |
| `tools/make-map.py` | Membuat ulang `peta.json` dari Natural Earth admin-1 10m |

## Mengganti data contoh dengan data asli

Isi `src/data-contoh.json` dengan struktur yang sama, lalu jalankan `node tools/build.js`.

- `meta`: periode, nama bulan, indeks bulan berjalan, dan daftar data yang belum masuk.
- `cabang`: satu baris per cabang. Deret bulanan berisi 9 angka (Januari sampai September). Nilai `null` berarti data belum masuk.
  - `mpp` dan `mp` per kelompok: `sales`, `afs` (aftersales), `admin`, `os`.
  - `gajiPokok` dan `lembur` dalam juta rupiah.
  - `keluar`: jumlah orang keluar per bulan untuk `sales`, `afs`, `admin`.
  - `prodSales`, `prodTeknisi`, `prodSA`: produktivitas per bulan.
  - `gpecYtd`, `gpecYtdAgustus`, `gpecYtdBulan`: GP/EC YTD.
  - `lat`, `lon`: lokasi perkiraan cabang di peta.
- `headOffice`, `tahunan`, `lemburDeptHO`: data Head Office, data tahunan FY20 sampai FY25, dan lembur per departemen HO.
