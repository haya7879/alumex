"use client";

import * as React from "react";

export default function NotificationsRoot() {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">الإشعارات</h3>
      <div className="space-y-2">
        {/* Add notifications content here */}
        <p className="text-sm text-gray-500">لا توجد إشعارات</p>
      </div>
    </div>
  );
}

