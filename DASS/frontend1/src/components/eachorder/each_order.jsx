import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/joy/IconButton';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';


const OrderCard = ({ product }) => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    console.log(`Navigating to product ${product._id}`);
    navigate(`/product/${product._id}`);
  };

  return (
    <Card
      sx={{
        width: 320,
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        gap: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Typography
        level="h2"
        sx={{
          fontSize: '1.25rem',
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#1a1a1a',
          mb: 1
        }}
      >
        {product.name}
      </Typography>
  
      <AspectRatio
        ratio="4/3"
        sx={{
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '8px',
          }}
        />
      </AspectRatio>
  
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: 0,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            width: '100%',
          }}
        >
          <div>
            <Typography level="body2" sx={{ color: '#666' }}>
              Quantity
            </Typography>
            <Typography sx={{ fontSize: '1.1rem', color: '#1a1a1a' }}>
              {product.count}
            </Typography>
          </div>
          <div>
            <Typography level="body2" sx={{ color: '#666' }}>
              Price (Each)
            </Typography>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2e7d32' }}>
              ${product.price}
            </Typography>
          </div>
        </div>
  
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <Typography level="body2" sx={{ color: '#666' }}>
          OTP:
        </Typography>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1976d2' }}>
          {product.otp}
        </Typography>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <Typography level="body2" sx={{ color: '#666' }}>
          Seller:
        </Typography>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a1a' }}>
          {product.sellerName}
        </Typography>
      </div>
  
        <Button
          variant="solid"
          color="primary"
          onClick={handleExploreClick}
          sx={{
            mt: 1,
            fontWeight: 600,
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          Explore
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderCard;