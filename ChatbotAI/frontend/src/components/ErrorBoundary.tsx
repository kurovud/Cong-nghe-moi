"use client";

import React from "react";

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <div className="notice notice--error">Đã xảy ra lỗi trong khu quản trị. Vui lòng tải lại trang hoặc quay về trang chủ.</div>
          <div style={{ marginTop: 12 }}>
            <button type="button" className="btn" onClick={() => window.location.reload()}>Tải lại</button>
            <button type="button" className="btn" style={{ marginLeft: 8 }} onClick={() => (window.location.href = "/")}>Về trang chủ</button>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
