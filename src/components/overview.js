const { default: Image } = require("next/image");
const { Button } = require("./ui/button");

export const Overview = () => {
  return (
    <div className="mt-8 px-8">
      <p className="text-4xl font-semibold">Overview</p>
      <div className="mt-8 p-4 py-6 bg-white rounded-lg flex drop-shadow-sm">
        <Image src={"/icons/hero.svg"} width={305} height={247} />
        <div className="w-full grid grid-cols-2">
          <div className="border-r w-full flex  items-center justify-center">
            <div>
              <p className="text-lg font-medium text-[#71737F]">
                Total Balance:
              </p>
              <div>
                <div className="flex items-center">
                  <div className="text-8xl font-semibold text-primary">450</div>
                  <div className="text-8xl font-semibold text-primary">$</div>
                </div>

                <Button className="w-full min-w-[17rem] max-w-[20rem] mt-2">
                  Send
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full flex  items-center justify-center">
            <div>
              <p className="text-xl font-medium">Request</p>
              <div>
                <p className="max-w-72 font-medium text-[#71737F]">
                  lorem isumlorem isumlorem isumlorem isum
                </p>

                <Button variant="outline" className="mt-2 py-8 px-16">
                  Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
