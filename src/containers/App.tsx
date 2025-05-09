import { Frame } from "@/components/Frame/Frame"
import { MainContext } from "@/context/MainContext"
import { useContext } from "react"
import style from "./App.module.scss"
import { Layout } from "./Layout"
import { PanelRoot } from "./Panel/PanelRoot"
import { OpenFormFrame } from "@/components/OpenFormFrame/OpenFormFrame"

const exampleData = {
  nodes: [
    { hash: "0x5e2e35efdbb254b570dc4e3adf9d1a3e233f6c4506de2cb2dfd7f29a3b579bc1" },
    { hash: "0x8f7b8a21802c4c9f3f43e237b1d38f7c4edc4d2e66078cf2b0f4e57b5fa7071b" },
    { hash: "0xb16f72b8e270f472f5c63f76f20a0fe0a42b397c0d26445214d6076c2c6a58c1" },
    { hash: "0xa2b20617452b625993d8c7a1a798d83c7a18e0e2281d1359bcb8a1a37c89a542" },
    { hash: "0x68de6f3b4c5e548f0f69c167ce12e3c03f1bfc9c75970b8911b5ae4d96d2b51d" },
    { hash: "0x7fa3e5e1ecbff2c0b0f409bfbdb7f01f672ab36c19dcb9116cce0e61234b1cc3" },
    { hash: "0x3cb9867c39076d221e3692de1bbfcfa9932f4e372317f53a36d5f1e8aa676d3e" },
    { hash: "0xd13ecfe2ff4a56fa2e7df4e625d3d4c3c1728375b4642582b0b4ad27c39cf51e" },
    { hash: "0x5d385dcd849d609e7d2680b2619aacc2b25367b3a2d63bcfdad64a74e792af2e" },
    { hash: "0x39fcab84e3ed35a94bfc2fba54c764727b893de6b36ebf0084dce3a20df2d7fa" },

    { hash: "0x3e1c7635d29d9c5a54e496e0172cc8f44e9f531f5c91b09e7c0a7d8b67e7b429" },
    { hash: "0xf536c84cf7d1e87854c0d7f8ef86c84ef4050b519b6d8d88b2e5c8dd54c14fa9" },
    { hash: "0x3a11b07349e4f17fa66123529b291f0ff3de278d597d14c546c12a6e252e251b" },
    { hash: "0x7ad0ad3b786160601206ae7cb64d6206b0c5f3260c2373f77cbf6f51f4f7d88d" },
    { hash: "0x9ed5faebf1bc9f2fcac1cba8c274f02e7b2f94cf67dfe0f5a38d66d5cf1a1444" },
    { hash: "0x402d38239a576e20d16a80e7a10363ef011ad678372a9ec2e622cd3e2298cc65" },
    { hash: "0x87cb43fd01cc4c69c017a6a72f89c843a25933fcdf34a379e91fffa4b4425f36" },
    { hash: "0x1d13c7b1e9cd6f9f8d71fabcdbab97d14e3ab2c1db7b13b7d11a4c41734ea273" },
    { hash: "0x823105f41386f207a471b58be15cbe105f3cc3e61c89cf2e0e0b015888ed09d9" },
    { hash: "0xdae050cddf3ef2e67f34e2c816d576c48c1bcba8a2b0ae0d2a86c3f33c3213c1" },
  ],
  links: [
    // Lineage A
    { source: "0x5e2e35efdbb254b570dc4e3adf9d1a3e233f6c4506de2cb2dfd7f29a3b579bc1", target: "0x8f7b8a21802c4c9f3f43e237b1d38f7c4edc4d2e66078cf2b0f4e57b5fa7071b" },
    { source: "0x8f7b8a21802c4c9f3f43e237b1d38f7c4edc4d2e66078cf2b0f4e57b5fa7071b", target: "0xb16f72b8e270f472f5c63f76f20a0fe0a42b397c0d26445214d6076c2c6a58c1" },
    { source: "0x8f7b8a21802c4c9f3f43e237b1d38f7c4edc4d2e66078cf2b0f4e57b5fa7071b", target: "0xa2b20617452b625993d8c7a1a798d83c7a18e0e2281d1359bcb8a1a37c89a542" },
    { source: "0xb16f72b8e270f472f5c63f76f20a0fe0a42b397c0d26445214d6076c2c6a58c1", target: "0x68de6f3b4c5e548f0f69c167ce12e3c03f1bfc9c75970b8911b5ae4d96d2b51d" },
    { source: "0xa2b20617452b625993d8c7a1a798d83c7a18e0e2281d1359bcb8a1a37c89a542", target: "0x68de6f3b4c5e548f0f69c167ce12e3c03f1bfc9c75970b8911b5ae4d96d2b51d" },
    { source: "0x68de6f3b4c5e548f0f69c167ce12e3c03f1bfc9c75970b8911b5ae4d96d2b51d", target: "0x7fa3e5e1ecbff2c0b0f409bfbdb7f01f672ab36c19dcb9116cce0e61234b1cc3" },
    { source: "0x7fa3e5e1ecbff2c0b0f409bfbdb7f01f672ab36c19dcb9116cce0e61234b1cc3", target: "0x3cb9867c39076d221e3692de1bbfcfa9932f4e372317f53a36d5f1e8aa676d3e" },
    { source: "0x3cb9867c39076d221e3692de1bbfcfa9932f4e372317f53a36d5f1e8aa676d3e", target: "0xd13ecfe2ff4a56fa2e7df4e625d3d4c3c1728375b4642582b0b4ad27c39cf51e" },
    { source: "0xd13ecfe2ff4a56fa2e7df4e625d3d4c3c1728375b4642582b0b4ad27c39cf51e", target: "0x5d385dcd849d609e7d2680b2619aacc2b25367b3a2d63bcfdad64a74e792af2e" },
    { source: "0x5d385dcd849d609e7d2680b2619aacc2b25367b3a2d63bcfdad64a74e792af2e", target: "0x39fcab84e3ed35a94bfc2fba54c764727b893de6b36ebf0084dce3a20df2d7fa" },

    // Lineage B (with branching and merging)
    { source: "0x3e1c7635d29d9c5a54e496e0172cc8f44e9f531f5c91b09e7c0a7d8b67e7b429", target: "0xf536c84cf7d1e87854c0d7f8ef86c84ef4050b519b6d8d88b2e5c8dd54c14fa9" },
    { source: "0xf536c84cf7d1e87854c0d7f8ef86c84ef4050b519b6d8d88b2e5c8dd54c14fa9", target: "0x3a11b07349e4f17fa66123529b291f0ff3de278d597d14c546c12a6e252e251b" },
    { source: "0xf536c84cf7d1e87854c0d7f8ef86c84ef4050b519b6d8d88b2e5c8dd54c14fa9", target: "0x7ad0ad3b786160601206ae7cb64d6206b0c5f3260c2373f77cbf6f51f4f7d88d" },
    { source: "0x7ad0ad3b786160601206ae7cb64d6206b0c5f3260c2373f77cbf6f51f4f7d88d", target: "0x9ed5faebf1bc9f2fcac1cba8c274f02e7b2f94cf67dfe0f5a38d66d5cf1a1444" },
    { source: "0x3a11b07349e4f17fa66123529b291f0ff3de278d597d14c546c12a6e252e251b", target: "0x9ed5faebf1bc9f2fcac1cba8c274f02e7b2f94cf67dfe0f5a38d66d5cf1a1444" },
    { source: "0x9ed5faebf1bc9f2fcac1cba8c274f02e7b2f94cf67dfe0f5a38d66d5cf1a1444", target: "0x402d38239a576e20d16a80e7a10363ef011ad678372a9ec2e622cd3e2298cc65" },
    { source: "0x402d38239a576e20d16a80e7a10363ef011ad678372a9ec2e622cd3e2298cc65", target: "0x87cb43fd01cc4c69c017a6a72f89c843a25933fcdf34a379e91fffa4b4425f36" },
    { source: "0x87cb43fd01cc4c69c017a6a72f89c843a25933fcdf34a379e91fffa4b4425f36", target: "0x1d13c7b1e9cd6f9f8d71fabcdbab97d14e3ab2c1db7b13b7d11a4c41734ea273" },
    { source: "0x1d13c7b1e9cd6f9f8d71fabcdbab97d14e3ab2c1db7b13b7d11a4c41734ea273", target: "0x823105f41386f207a471b58be15cbe105f3cc3e61c89cf2e0e0b015888ed09d9" },
    { source: "0x823105f41386f207a471b58be15cbe105f3cc3e61c89cf2e0e0b015888ed09d9", target: "0xdae050cddf3ef2e67f34e2c816d576c48c1bcba8a2b0ae0d2a86c3f33c3213c1" }
  ]
};

export function App() {
  const ctx = useContext(MainContext)

  return (
    <div className={style.root}>
      <Layout
        panel={<PanelRoot />}
        frame={ctx.mode === "long"
          ? <Frame url={ctx.url} />
          : <OpenFormFrame nodes={exampleData.nodes} links={exampleData.links} />
        }
      />
    </div>
  )
}
