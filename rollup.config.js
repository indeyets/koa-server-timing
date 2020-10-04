import esbuild from "rollup-plugin-esbuild";
// import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/index.ts",
    external: ["assert"],
    output: {
      file: "dist/index.js",
      format: "commonjs",
    },
    plugins: [
      esbuild({
        // All options are optional
        include: /\.[jt]s$/,
        exclude: /node_modules/, // default
        minify: process.env.NODE_ENV === "production",
        target: "es2017", // default, or 'es20XX', 'esnext'
        // Like @rollup/plugin-replace
        define: {
          __VERSION__: '"x.y.z"',
        },
      }),
    ],
  },
  // {
  //   input: "index.ts",
  //   output: {
  //     file: "dist/index.d.ts",
  //     format: "es",
  //     plugins: [dts()],
  //   },
  // },
];
