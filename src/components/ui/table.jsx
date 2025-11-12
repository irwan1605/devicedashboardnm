import * as React from "react";

export function Table({ children, className = "", ...props }) {
  return (
    <table
      className={`w-full border-collapse text-sm text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </table>
  );
}

export function TableHeader({ children, className = "", ...props }) {
  return (
    <thead className={`bg-gray-100 text-left ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "", ...props }) {
  return <tbody className={`divide-y ${className}`}>{children}</tbody>;
}

export function TableRow({ children, className = "", ...props }) {
  return <tr className={`hover:bg-gray-50 ${className}`}>{children}</tr>;
}

export function TableCell({ children, className = "", ...props }) {
  return (
    <td className={`px-4 py-2 whitespace-nowrap ${className}`} {...props}>
      {children}
    </td>
  );
}

export function TableHead({ children, className = "", ...props }) {
  return (
    <th className={`px-4 py-2 font-medium text-gray-800 ${className}`} {...props}>
      {children}
    </th>
  );
}


//  {/* === STATS === */}
//  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//  {["Total Devices", "Active Devices", "Inactive Devices"].map((label, i) => (
//    <motion.div key={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
//      <Card className="transition-all duration-500 hover:scale-[1.02] hover:shadow-glow dark:hover:shadow-blue-400/30 text-center">
//        <CardHeader>
//          <CardTitle className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
//            {label === "Total Devices"
//              ? filteredDevices.length
//              : label === "Active Devices"
//              ? filteredDevices.filter((d) => d.active === "Yes").length
//              : filteredDevices.filter((d) => d.active === "No").length}
//          </CardTitle>
//          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{label}</p>
//        </CardHeader>
//      </Card>
//    </motion.div>
//  ))}
// </div>
