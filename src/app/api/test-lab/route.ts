import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "baseline";

  const baseline = {
    latitude: 28.6139, longitude: 77.2090, timezone: "Asia/Kolkata",
    current: { temperature_2m: 36.4, relative_humidity_2m: 35, apparent_temperature: 38.7, wind_speed_10m: 9.9, weather_code: 0 },
  };

  if (mode === "baseline") {
    return NextResponse.json({ source: "Open-Meteo Weather API (Delhi)", mode: "baseline", endpoint: "/v1/forecast", schema: { latitude: "number", longitude: "number", timezone: "string", current: { temperature_2m: "number", relative_humidity_2m: "number", apparent_temperature: "number", wind_speed_10m: "number", weather_code: "number" } }, response: baseline, timestamp: new Date().toISOString() });
  }

  const drifted = {
    latitude: baseline.latitude, longitude: baseline.longitude, timezone: baseline.timezone,
    current_weather: { temp: 36.4, humidity: 35, feels_like: 38.7, wind_speed: 9.9, condition_code: 0, is_day: true },
    elevation: 214,
  };

  return NextResponse.json({
    source: "Open-Meteo (schema changed!)", mode: "drifted", endpoint: "/v1/forecast",
    driftDetected: [
      { type: "rename", from: "current.temperature_2m", to: "current_weather.temp", severity: "medium", confidence: 92 },
      { type: "rename", from: "current.relative_humidity_2m", to: "current_weather.humidity", severity: "medium", confidence: 94 },
      { type: "rename", from: "current.apparent_temperature", to: "current_weather.feels_like", severity: "medium", confidence: 91 },
      { type: "rename", from: "current.wind_speed_10m", to: "current_weather.wind_speed", severity: "medium", confidence: 88 },
      { type: "rename", from: "current.weather_code", to: "current_weather.condition_code", severity: "medium", confidence: 86 },
      { type: "missing_field", from: "current", to: "undefined", severity: "high", confidence: 95 },
      { type: "new_field", from: "current_weather.is_day", to: "boolean", severity: "low", confidence: 99 },
      { type: "new_field", from: "elevation", to: "number", severity: "low", confidence: 99 },
    ],
    patchesGenerated: [
      { type: "rename", from: "current_weather.temp", to: "current.temperature_2m", confidence: 92, reason: "Field renamed from temperature_2m to temp" },
      { type: "rename", from: "current_weather.humidity", to: "current.relative_humidity_2m", confidence: 94, reason: "Field renamed from relative_humidity_2m to humidity" },
      { type: "rename", from: "current_weather.feels_like", to: "current.apparent_temperature", confidence: 91, reason: "Field renamed from apparent_temperature to feels_like" },
      { type: "add_default", from: "current.is_day", to: "current.is_day", confidence: 85, reason: "New field added with default value" },
    ],
    protectedFieldsBlocked: [{ field: "weather_code → condition_code", reason: "Weather code is in protected list — AI cannot modify" }],
    response: drifted,
    originalResponse: baseline,
    patchedResponse: { latitude: 28.6139, longitude: 77.2090, timezone: "Asia/Kolkata", current: { temperature_2m: 36.4, relative_humidity_2m: 35, apparent_temperature: 38.7, wind_speed_10m: 9.9, weather_code: 0, is_day: true }, elevation: 214 },
    overallConfidence: 90, autoPatch: false, timestamp: new Date().toISOString(),
  });
}
