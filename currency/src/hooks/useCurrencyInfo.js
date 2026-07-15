//https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json
import { useEffect, useState } from "react";

function useCurrencyInfo(currency){

    const [data, setData]=useState({})

    useEffect(()=>{
        const controller = new AbortController()

        fetch(
            `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`,
            { signal: controller.signal }
        )
            .then((res) => res.json())
            .then((res) => setData(res?.[currency] ?? {}))
            .catch(() => setData({}))

        return () => controller.abort()
    }, [currency])

    return data;
}

export default useCurrencyInfo