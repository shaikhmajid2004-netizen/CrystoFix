"use client";

import { useState } from "react";

export default function AddVehiclePage() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    fuelType: "",
    registration: "",
    color: "",
  });

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "/api/vehicles/add",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            brand: formData.brand,
            model: formData.model,
            registration:
              formData.registration,
            fuelType:
              formData.fuelType,
            color: formData.color,
            year: formData.year
              ? Number(formData.year)
              : undefined,
          }),
        }
      );

      const data =
        await response.json();

      alert(data.message);

      if (data.success) {
        setFormData({
          brand: "",
          model: "",
          year: "",
          fuelType: "",
          registration: "",
          color: "",
        });
      }
    } catch (error) {
      alert("Failed to save vehicle");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#111111] p-8 md:p-10 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            🚗 CrystoFix Vehicle Registry
          </div>

          <h1 className="mt-5 text-4xl font-bold md:text-5xl">
            Add Vehicle
          </h1>

          <p className="mt-3 text-zinc-400">
            Register your vehicle and
            manage service history,
            repairs and maintenance.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <input
            type="text"
            placeholder="Brand (Honda, Hyundai)"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none transition focus:border-blue-500"
            value={formData.brand}
            onChange={(e) =>
              setFormData({
                ...formData,
                brand: e.target.value,
              })
            }
            required
          />

          <input
            type="text"
            placeholder="Model"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none transition focus:border-blue-500"
            value={formData.model}
            onChange={(e) =>
              setFormData({
                ...formData,
                model: e.target.value,
              })
            }
            required
          />

          <input
            type="number"
            placeholder="Year"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none transition focus:border-blue-500"
            value={formData.year}
            onChange={(e) =>
              setFormData({
                ...formData,
                year: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Fuel Type"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none transition focus:border-blue-500"
            value={formData.fuelType}
            onChange={(e) =>
              setFormData({
                ...formData,
                fuelType:
                  e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Registration Number"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none transition focus:border-blue-500"
            value={formData.registration}
            onChange={(e) =>
              setFormData({
                ...formData,
                registration:
                  e.target.value.toUpperCase(),
              })
            }
            required
          />

          <input
            type="text"
            placeholder="Vehicle Color"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none transition focus:border-blue-500"
            value={formData.color}
            onChange={(e) =>
              setFormData({
                ...formData,
                color: e.target.value,
              })
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-4 font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving Vehicle..."
            : "Save Vehicle"}
        </button>
      </form>
    </main>
  );
}