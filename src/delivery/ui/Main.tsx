import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { Routing } from "src/routing";
import { checkConnection } from "ui/plocs/connection/actions";
import { store } from "ui/store";

const defaultAddress = 'localhost:3001';

export const Main = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkConnection(defaultAddress));
  }, [dispatch]);

  return (
    <Provider store={store}>
      <Routing />
    </Provider>
  );
};
