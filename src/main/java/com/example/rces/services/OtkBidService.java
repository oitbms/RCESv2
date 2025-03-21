//сервис заявки отк
package com.example.rces.services;

import com.example.rces.models.OtkBid;
import org.springframework.stereotype.Service;

import java.security.PublicKey;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OtkBidService {
    private List<OtkBid> OtkBids = new ArrayList<>();
    //private UUID id = 552189d6-1111-11ef-1621-441f13216406;

    public List<OtkBid> listOtkBids() {return OtkBids;}

    public void SaveOtkBid(OtkBid OtkBid) {
        OtkBids.add(OtkBid);
    }

    public void deleteOtkBid(UUID id) {
        OtkBids.removeIf(OtkBid -> OtkBid.getId().equals(id));
    }
}
