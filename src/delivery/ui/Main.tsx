import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routing } from "src/routing";
import { checkConnection } from "ui/plocs/connection/actions";
import { checkLatestFrontendRelease } from "ui/plocs/packages/actions";

const defaultAddress = 'localhost:3001';

export const Main = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkConnection(defaultAddress));
    dispatch(checkLatestFrontendRelease());
  }, [dispatch]);

  return (
    <Routing />
  );
};
