import React, { useEffect, useState } from "react";
import ProductItem from "../components/UI/ProductItem";
import type { Product } from "../axios/types";
import { Carousel, Input, message, Spin } from "antd";
import { useDebounce } from "../hooks/customHook";
import { SearchOutlined } from "@ant-design/icons";
import productService from "../axios/productService";

const Product = () => {
  const [itemsPerPage, setItemsPerPage] = useState(6); // Giá trị mặc định dropdown
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    setHasMore(false);
    fetchProducts(debouncedSearchText, page, itemsPerPage);
  }, [debouncedSearchText, page, itemsPerPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore) return; // tránh gọi lại API nhiều lần

      const { scrollHeight, scrollTop, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 1) {
        setPage(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  const fetchProducts = async (name: string, page: number, offset: number) => {
    try {
      // Fetch data from API (using axios)
      const response = await productService.getAllProduct(name, page, offset);
      if (page > 1) {
        setProducts([...products, ...response.data]);
      } else {
        // page = 1
        setProducts(response.data);
      }
      setHasMore(response.data.length > 0);
    } catch (error) {
      message.error("Error fetching products");
    } finally {
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setItemsPerPage(Number(event.target.value));
  };

  return (
    <div className="flex flex-col gap-y-10">
      <section className="">
        <Carousel
          autoplay
          autoplaySpeed={2000}
          draggable
        >
          <img className="w-full h-full  object-contain" src={"banner.png"} />
          <img className="w-full h-full  object-contain" src={"banner2.png"} />
        </Carousel>
        
      </section>
      
      {/*  Product list */}
      <section className="max-w-[1400px] w-full mx-auto flex flex-col gap-y-3 px-2">
        <h3 className="text-2xl font-bold text-center mb-10">
          THỜI TRANG HOT NHẤT
        </h3>

        <div className="flex justify-between">
          <div className="max-w-[180px] lg:max-w-[400px] w-full">
            <Input
              value={searchText}
              onChange={(e) => {
                setPage(1);
                setSearchText(e.target.value);
              }}
              placeholder="Tìm kiếm các sản phẩm"
              suffix={<SearchOutlined />} // Thêm icon tìm kiếm vào cuối input
            />
          </div>
          <div className="text-sm flex gap-x-2 items-center">
            <label htmlFor="itemsPerPage">Số sản phẩm:</label>
            <select
              className="border-[0.5px] outline-none"
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleChange}
            >
              <option value={6}>6</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
            </select>
          </div>
        </div>

        <div className="max-w-[1400px]  mx-auto w-full flex flex-col gap-y-10">
          <div
            className={`grid gap-x-5 gap-y-10 grid-cols-2 justify-items-center ${
              itemsPerPage === 6 ? " md:grid-cols-3" : " md:grid-cols-4"
            }`}
          >
            {products.map((product, index) => (
              <ProductItem key={index} product={product} />
            ))}
          </div>
          {hasMore && <Spin size="large" />}
        </div>
      </section>
    </div>
  );
};

export default Product;
