import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useRef, useState } from "react";
import Layout from "../components/layout";
import AxiosApi from "../pages/api/axios-api";

export default function App({ Component, pageProps }: AppProps) {
  const mounted = useRef(true);
  const [displayHeader, setDisplayHeader] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [customer, setCustomer] = useState({});
  const [names, setNames] = useState({});
  const [facility, setFacility] = useState({});
  const [loading, setLoading] = useState(true);
  const imageUrl = process.env.IMAGE_URL ? process.env.IMAGE_URL : "";
 
  useEffect(() => {
    if (mounted.current) {
      getData();
      mounted.current = false;
    }
  });
  const getData = async () => {
    const response = await AxiosApi.call({}, `customer`, "get", "");
    
    if (response.data) {
      const namesResponse = await AxiosApi.call({}, `names`, "get", "");
      if (namesResponse.data) {
        const facilityResponse = await AxiosApi.call(
          {},
          `facilities`,
          "get",
          ""
        );
        if (facilityResponse.data) {
          setDisplayHeader(response.data.display_header);
          setDisplayName(response.data.display_name);
          setCustomer(response.data);
          setNames(namesResponse.data);
          setFacility(facilityResponse.data[0]);
          setLoading(false);
        }
      }
    }
  };
  return (
    <Layout
      displayHeader={displayHeader}
      displayName={displayName}
    >
      {loading ? null : (
        <Component
          {...pageProps}
          names={names}
          facilityData={facility}
          customer={customer}
          imageUrl={imageUrl}
        />
      )}
    </Layout>
  );
}
