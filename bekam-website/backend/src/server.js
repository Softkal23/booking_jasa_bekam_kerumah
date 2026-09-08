import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import { bookingsRouter } from "./routes/bookings.js";
import { adminRouter } from "./routes/admin.js";

const app = express();
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";

app.use(helmet());
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json({ limit: "20kb" })); // batasi ukuran body cegah payload besar

app.use("/api", bookingsRouter);
app.use("/api/admin", adminRouter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

// Handler generik, jangan bocorkan detail error internal ke client.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, errors: ["Terjadi kesalahan tak terduga."] });
});

app.listen(PORT, () => {
  console.log(`BekamCare API berjalan di http://localhost:${PORT}`);
});
