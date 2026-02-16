"use client";

import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store, AppDispatch } from "../redux/store";
import { hydrateAuth } from "../redux/features/authSlice";

function HydrateAuth() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return null;
}

export default function ReduxProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <HydrateAuth />
      {children}
    </Provider>
  );
}
