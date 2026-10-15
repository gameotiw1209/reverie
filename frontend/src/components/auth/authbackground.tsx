export default function AuthBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden bg-[#131313]"
    >
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCMnxsYzybsMVL7iKC3_l9qPbb8esHJyzwNm4sJRNn5IUqM-GBvgaaCFt3cK0rQ4pUbQDOWGaAGdH8f8jsQC4kdg2OucBReyMgyoSWJN4aXeWc-TwOm5ZQqOFb_Yge-LNKLl0oSBWr0kHTmq5Fw4951Tb7elEd2kGGXMhZw9HcRF1CcurJx-MTlKfUVidErhlpswWyaQ325ZNjbG8e0X2wM5cz-_67m-wlHYpkX8H2KB5hcRgghaod3-zirRh8NzJPVBg')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/95 via-[#121212]/75 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-[#131313]/50" />

      <div className="absolute inset-0 bg-black/20 backdrop-blur-[5px]" />
    </div>
  );
}