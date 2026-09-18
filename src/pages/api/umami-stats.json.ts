import { analyticsConfig } from "@/config";

export async function GET(): Promise<Response> {
	const umami = analyticsConfig.umamiAnalytics;
	const statsApiUrl = umami?.statsApiUrl?.replace(/\/$/, "");
	const websiteId = umami?.websiteId;
	const apiToken = umami?.apiToken;

	if (!statsApiUrl || !websiteId || !apiToken) {
		return new Response(JSON.stringify({ uv: null, pv: null }), {
			headers: { "Content-Type": "application/json; charset=utf-8" },
		});
	}

	const url = `${statsApiUrl}/api/websites/${websiteId}/stats?startAt=0&endAt=${Date.now()}`;

	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${apiToken}` },
	});

	if (!res.ok) {
		return new Response(JSON.stringify({ uv: null, pv: null }), {
			status: res.status,
			headers: { "Content-Type": "application/json; charset=utf-8" },
		});
	}

	const data = await res.json();

	return new Response(
		JSON.stringify({
			uv: data?.visitors?.value ?? null,
			pv: data?.pageviews?.value ?? null,
		}),
		{ headers: { "Content-Type": "application/json; charset=utf-8" } },
	);
}
